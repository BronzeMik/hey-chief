import { NextResponse } from "next/server";
import { redis } from "@/lib/upstash";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01";
const CACHE_TTL_SECONDS = 60 * 10;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: Request, ctx: any) {
  try {
    const { handle } = await (ctx?.params ?? ctx);
    if (!handle) return NextResponse.json({ error: "Missing handle" }, { status: 400 });

    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
      return NextResponse.json({ error: "Shopify configuration missing" }, { status: 500 });
    }

    const cacheKey = `collection:${handle}`;

    // Redis cache
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(
          { products: cached },
          { headers: { "x-cache": "HIT", "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59` } }
        );
      }
    } catch (err) {
      console.warn(`[collection:${handle}] Upstash GET failed:`, err);
    }

    const query = `
      query getCollectionProducts($handle: String!) {
        collection(handle: $handle) {
          products(first: 20) {
            edges {
              node {
                id
                title
                handle
                images(first: 1) { edges { node { url altText } } }
                variants(first: 1) { edges { node { id price { amount currencyCode } } } }
              }
            }
          }
        }
      }
    `;

    const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables: { handle } }),
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
    const data = await res.json();
    const col = data?.data?.collection;
    if (!col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

    const products = col.products.edges.map((e: any) => {
      const p = e.node;
      const firstImage = p.images.edges[0]?.node;
      const firstVariant = p.variants.edges[0]?.node;
      return {
        id: p.id,
        variantId: firstVariant?.id || p.id,
        title: p.title,
        handle: p.handle,
        image: firstImage?.url || "/streetwear-cap.png",
        price: firstVariant ? Number.parseFloat(firstVariant.price.amount) : 0,
      };
    });

    try {
      await redis.set(cacheKey, products, { ex: CACHE_TTL_SECONDS });
    } catch (err) {
      console.warn(`[collection:${handle}] Upstash SET failed:`, err);
    }

    return NextResponse.json(
      { products },
      { headers: { "x-cache": "MISS", "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59` } }
    );
  } catch (err) {
    console.error("Collection API error:", err);
    return NextResponse.json({ error: "Failed to fetch collection products" }, { status: 500 });
  }
}
