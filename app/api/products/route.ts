import { NextResponse } from "next/server";
import "server-only";
import { redis } from "@/lib/upstash";

const { SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN, SHOPIFY_API_VERSION = "2024-07" } = process.env;

const SF_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $after: String, $query: String) @inContext(country: US, language: EN) {
    products(first: $first, after: $after, query: $query) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        title
        handle
        images(first: 1) { nodes { url } }
        priceRange { minVariantPrice { amount currencyCode } }
        tags
        variants(first: 1) { nodes { id } }
      }
    }
  }
`;

const CACHE_TTL_SECONDS = 60 * 10;

export async function GET(req: Request) {
  try {
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
      return NextResponse.json({ error: "Missing Shopify env" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = category ? `tag:'${category}'` : undefined;

    const cacheKey = `products:all${category ? `:category=${category}` : ""}`;

    // Try Redis cache first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json({ products: cached }, {
          headers: { "x-cache": "HIT", "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59` }
        });
      }
    } catch (err) {
      console.warn("[products] Redis GET failed, continuing:", err);
    }

    // Fetch all products using pagination
    let allProducts: any[] = [];
    let after: string | null = null;
    const perPage = 250; // Shopify max per request

    do {
      const r = await fetch(SF_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN!,
        },
        body: JSON.stringify({ query: PRODUCTS_QUERY, variables: { first: perPage, after, query } }),
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
        price: Number(p.priceRange.minVariantPrice.amount),
        category: category ?? "uncategorized",
      }));
      allProducts = allProducts.concat(mapped);

      after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
    } while (after);

    // Store in Redis
    try {
      await redis.set(cacheKey, allProducts, { ex: CACHE_TTL_SECONDS });
    } catch (err) {
      console.warn("[products] Redis SET failed:", err);
    }

    return NextResponse.json({ products: allProducts }, {
      headers: { "x-cache": "MISS", "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59` }
    });
  } catch (e) {
    console.error("[v0] Products API error:", e);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
