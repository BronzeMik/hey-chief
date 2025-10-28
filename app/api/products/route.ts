// app/api/products/route.ts
import { NextResponse } from "next/server";
import "server-only";
import { redis } from "@/lib/upstash";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const {
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN,
  SHOPIFY_API_VERSION = "2024-07",
} = process.env;

const SF_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $after: String, $query: String)
  @inContext(country: US, language: EN) {
    products(first: $first, after: $after, query: $query, sortKey: RELEVANCE) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        title
        handle
        images(first: 1) { nodes { url altText } }
        priceRange { minVariantPrice { amount currencyCode } }
        tags
        variants(first: 1) { nodes { id } }
        color: metafield(namespace: "custom", key: "color") { value }
        emblemShape: metafield(namespace: "custom", key: "emblem_shape") { value }
        style: metafield(namespace: "custom", key: "style") { value }
        emblemColor: metafield(namespace: "custom", key: "emblem_color") { value }
      }
    }
  }
`;

const CACHE_TTL_SECONDS = 60 * 10;

/** Strip only characters that break Shopify’s query parser */
function esc(v: string) {
  return v.replace(/[()"]/g, "").trim();
}

/** Quote values that contain non-alphanumerics (spaces, dashes, etc.) */
function quote(v: string) {
  return /[^A-Za-z0-9]/.test(v) ? `'${v}'` : v;
}

function toArray(v: string | string[] | null): string[] {
  if (!v) return [];
  return Array.isArray(v)
    ? v
    : v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

/** Generate tolerant variants for a value (handles hyphen/space differences, extra spacing) */
function variantsFor(v: string): string[] {
  const base = esc(v);                         // "Flat-Top Hexagon"
  const withSpace = base.replace(/-/g, " ");   // "Flat Top Hexagon"
  const withHyphen = base.replace(/\s+/g, "-"); // "Flat-Top-Hexagon" (covers odd inputs)
  const compactSpaces = base.replace(/[-\s]+/g, " "); // collapse to single spaces
  const trimmed = base.trim();
  const set = new Set([trimmed, withSpace.trim(), withHyphen.trim(), compactSpaces.trim()]);
  return Array.from(set).filter(Boolean);
}

/** Build an OR block for one metafield key with tolerant variants */
function orBlock(nsKey: string, values: string[]) {
  if (!values.length) return "";
  const terms: string[] = [];
  for (const raw of values) {
    for (const alt of variantsFor(raw)) {
      terms.push(`metafield:${nsKey}:${quote(alt)}`);
    }
  }
  // dedupe
  const uniq = Array.from(new Set(terms));
  return `(${uniq.join(" OR ")})`;
}

function buildQuery(params: URLSearchParams) {
  const parts: string[] = [];

  // Optional tag/category constraint (keep only if you use it)
  const category = params.get("category");
  if (category) parts.push(`tag:'${esc(category)}'`);

  // Free-text search
  const q = params.get("q");
  if (q && q.trim()) parts.push(q.trim());

  // Facets
  const color = toArray(params.get("color"));
  const emblemShape = toArray(params.get("emblem_shape"));
  const style = toArray(params.get("style"));
  const emblemColor = toArray(params.get("emblem_color"));

  const blocks = [
    orBlock("custom.color", color),
    orBlock("custom.emblem_shape", emblemShape),
    orBlock("custom.style", style),
    orBlock("custom.emblem_color", emblemColor),
  ].filter(Boolean);

  parts.push(...blocks);

  console.log(parts)

  // If nothing provided, Shopify prefers null over empty string
  return parts.length ? parts.join(" AND ") : null;
}

/** Bump VERSION when you change query-building so old Redis keys don’t stick */
function cacheKeyFromParams(sp: URLSearchParams) {
  const VERSION = "v4-tolerant";
  const keys = ["category", "q", "color", "emblem_shape", "style", "emblem_color", "after"];
  const obj: Record<string, string> = {};
  keys.forEach((k) => {
    const v = sp.get(k);
    if (v) obj[k] = v;
  });
  const base =
    Object.entries(obj)
      .map(([k, v]) => `${k}=${v}`)
      .join("&") || "all";
  return `products:${VERSION}:${base}`;
}

export async function GET(req: Request) {
  try {
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
      return NextResponse.json({ error: "Missing Shopify env" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const queryVar = buildQuery(searchParams);
    const perPage = 250;
    const key = cacheKeyFromParams(searchParams);

    // Skip cache automatically when any filter/search is present
    const skipCache =
      searchParams.has("q") ||
      searchParams.has("color") ||
      searchParams.has("emblem_shape") ||
      searchParams.has("style") ||
      searchParams.has("emblem_color");

    if (!skipCache) {
      try {
        const cached = await redis.get(key);
        if (cached) {
          return NextResponse.json(
            { products: cached },
            {
              headers: {
                "x-cache": "HIT",
                "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59`,
              },
            }
          );
        }
      } catch (err) {
        console.warn("[products] Redis GET failed, continuing:", err);
      }
    }

    // Live fetch from Shopify
    let allProducts: any[] = [];
    let after: string | null = searchParams.get("after");

    do {
      const r = await fetch(SF_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN!,
        },
        body: JSON.stringify({
          query: PRODUCTS_QUERY,
          variables: { first: perPage, after, query: queryVar },
        }),
        cache: "no-store",
      });

      const json = await r.json();
      if (!r.ok || json.errors) {
        const msg = json?.errors?.map((e: any) => e.message).join("; ") || r.statusText;
        return NextResponse.json({ error: `Shopify error: ${msg}`, details: json }, { status: 502 });
      }

      const { nodes, pageInfo } = json.data.products;

      const mapped = nodes.map((p: any) => ({
        id: p.id,
        variantId: p.variants.nodes[0]?.id ?? null,
        title: p.title,
        handle: p.handle,
        image: p.images.nodes[0]?.url ?? null,
        imageAlt: p.images.nodes[0]?.altText ?? p.title,
        price: Number(p.priceRange.minVariantPrice.amount),
        currencyCode: p.priceRange.minVariantPrice.currencyCode,
        color: p.color?.value ?? null,
        emblemShape: p.emblemShape?.value ?? null,
        style: p.style?.value ?? null,
        emblemColor: p.emblemColor?.value ?? null,
        tags: p.tags ?? [],
      }));

      allProducts = allProducts.concat(mapped);
      after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
    } while (after);

    // Only cache unfiltered requests
    console.log(allProducts)
      try {
        await redis.set(key, allProducts, { ex: CACHE_TTL_SECONDS });
      } catch (err) {
        console.warn("[products] Redis SET failed:", err);
      }
    

    return NextResponse.json(
      { products: allProducts },
      {
        headers: {
          "x-cache": skipCache ? "BYPASS" : "MISS",
          "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59`,
        },
      }
    );
  } catch (e) {
    console.error("[api/products] error:", e);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
