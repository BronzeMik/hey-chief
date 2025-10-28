// app/api/collections/[handle]/route.ts
import { NextResponse } from "next/server";
import "server-only";
import { redis } from "@/lib/upstash";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-07";
const SF_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

const CACHE_TTL_SECONDS = 60 * 10;

const COLLECTION_QUERY = /* GraphQL */ `
  query CollectionProducts($handle: String!, $first: Int!, $after: String)
  @inContext(country: US, language: EN) {
    collection(handle: $handle) {
      id
      title
      products(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          title
          handle
          tags
          images(first: 1) { nodes { url altText } }
          priceRange { minVariantPrice { amount currencyCode } }
          variants(first: 1) { nodes { id } }
          color: metafield(namespace: "custom", key: "color") { value }
          emblemShape: metafield(namespace: "custom", key: "emblem_shape") { value }
          style: metafield(namespace: "custom", key: "style") { value }
          emblemColor: metafield(namespace: "custom", key: "emblem_color") { value }
        }
      }
    }
  }
`;

export async function GET(_req: Request, ctx: { params: { handle: string } }) {
  try {
    // ✅ must await params now
    const { handle } = await ctx.params;

    if (!handle) {
      return NextResponse.json({ error: "Missing collection handle" }, { status: 400 });
    }

    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
      return NextResponse.json({ error: "Shopify configuration missing" }, { status: 500 });
    }

    const cacheKey = `collection:v2:${handle}`;

    // Try Redis
    try {
      const cached = await redis.get(cacheKey);
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
      console.warn(`[collection:${handle}] Upstash GET failed:`, err);
    }

    const perPage = 250; // Shopify max per request
    let all: any[] = [];
    let after: string | null = null;

    do {
      const r = await fetch(SF_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN!,
        },
        body: JSON.stringify({
          query: COLLECTION_QUERY,
          variables: { handle, first: perPage, after },
        }),
        cache: "no-store",
      });

      const json = await r.json();
      if (!r.ok || json.errors) {
        const msg = json?.errors?.map((e: any) => e.message).join("; ") || r.statusText;
        return NextResponse.json(
          { error: `Shopify error: ${msg}`, details: json },
          { status: 502 }
        );
      }

      const col = json?.data?.collection;
      if (!col) {
        return NextResponse.json({ error: `Collection "${handle}" not found` }, { status: 404 });
      }

      const { nodes, pageInfo } = col.products;

      const mapped = nodes.map((p: any) => ({
        id: p.id,
        variantId: p.variants?.nodes?.[0]?.id ?? null,
        title: p.title,
        handle: p.handle,
        image: p.images?.nodes?.[0]?.url ?? "/streetwear-cap.png",
        imageAlt: p.images?.nodes?.[0]?.altText ?? p.title,
        price: Number(p.priceRange?.minVariantPrice?.amount ?? 0),
        currencyCode: p.priceRange?.minVariantPrice?.currencyCode ?? "USD",
        color: p.color?.value ?? null,
        emblemShape: p.emblemShape?.value ?? null,
        style: p.style?.value ?? null,
        emblemColor: p.emblemColor?.value ?? null,
        tags: p.tags ?? [],
      }));

      all = all.concat(mapped);
      after = pageInfo?.hasNextPage ? pageInfo.endCursor : null;
    } while (after);

    try {
      await redis.set(cacheKey, all, { ex: CACHE_TTL_SECONDS });
    } catch (err) {
      console.warn(`[collection:${handle}] Upstash SET failed:`, err);
    }

    return NextResponse.json(
      { products: all },
      {
        headers: {
          "x-cache": "MISS",
          "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59`,
        },
      }
    );
  } catch (err) {
    console.error("[api/collections/[handle]] error:", err);
    return NextResponse.json({ error: "Failed to fetch collection products" }, { status: 500 });
  }
}
