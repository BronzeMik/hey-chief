// app/api/collections/[handle]/route.ts
import { NextResponse } from "next/server";
import { redis } from "@/lib/upstash";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01";
const CACHE_TTL_SECONDS = 60 * 10;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ handle: string }> } // 👈 Next 15: params is a Promise
) {
  try {
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
      return NextResponse.json({ error: "Shopify configuration missing" }, { status: 500 });
    }

    const { handle } = await params; // 👈 must await in Next 15
    const cacheKey = `collection:${handle}`;

    // --- your existing logic below unchanged ---
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) {
      return NextResponse.json(
        { products: cached },
        { headers: { "x-cache": "HIT", "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59` } }
      );
    }

    const query = `
      query getCollectionProducts($handle: String!) {
        collection(handle: $handle) {
          id
          title
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

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN!,
        },
        body: JSON.stringify({ query, variables: { handle } }),
        cache: "no-store",
      }
    );

    if (!response.ok) throw new Error(`Shopify API error: ${response.status}`);

    const data = await response.json();
    if (data.errors) throw new Error("GraphQL query failed");
    if (!data.data.collection) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

    const products = data.data.collection.products.edges.map((edge: any) => {
      const product = edge.node;
      const firstImage = product.images.edges[0]?.node;
      const firstVariant = product.variants.edges[0]?.node;

      return {
        id: product.id,
        variantId: firstVariant?.id || product.id,
        title: product.title,
        handle: product.handle,
        image: firstImage?.url || "/streetwear-cap.png",
        price: firstVariant ? Number.parseFloat(firstVariant.price.amount) : 0,
      };
    });

    await redis.set(cacheKey, products, { ex: CACHE_TTL_SECONDS }).catch(() => {});
    return NextResponse.json(
      { products },
      { headers: { "x-cache": "MISS", "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59` } }
    );
  } catch (error) {
    console.error("Collection API error:", error);
    return NextResponse.json({ error: "Failed to fetch collection products" }, { status: 500 });
  }
}
