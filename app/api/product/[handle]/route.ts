// app/api/product/[handle]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { redis } from "@/lib/upstash";
import "server-only";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01";
const CACHE_TTL_SECONDS = 60 * 10;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest, ctx: any) {
  try {
    // Works in Next 14 (sync) and Next 15 (async) params
    const p = await (ctx?.params ?? ctx);
    const paramHandle: string | undefined = p?.handle;

    // Fallback to URL parsing if needed
    const urlHandle = new URL(request.url).pathname.split("/").filter(Boolean).pop();

    // Decode to be safe with special chars
    const handle = decodeURIComponent(paramHandle ?? urlHandle ?? "");
    if (!handle) {
      return NextResponse.json({ error: "Missing product handle" }, { status: 400 });
    }

    if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
      return NextResponse.json({ error: "Shopify configuration missing" }, { status: 500 });
    }

    const cacheKey = `product:${handle.toLowerCase()}`;

    // Try Redis first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const headers = new Headers({
          "x-cache": "HIT",
          "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59`,
        });
        return NextResponse.json({ product: cached }, { headers });
      }
    } catch (kvErr) {
      console.warn("[product] Upstash GET failed (continuing):", kvErr);
    }

    const query = `
      query getProductByHandle($handle: String!) @inContext(country: US, language: EN) {
        product(handle: $handle) {
          id
          handle
          title
          description
          images(first: 10) {
            edges { node { url altText } }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
              }
            }
          }
          tags
          vendor
          productType
        }
      }
    `;

    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
        },
        body: JSON.stringify({ query, variables: { handle } }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = (await response.json().catch(() => ({}))) as any;

    if (data?.errors) {
      console.error("[product] GraphQL errors:", data.errors);
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }

    const shopifyProduct = data?.data?.product;
    if (!shopifyProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Transform Shopify product to our format (null-safe variant)
    const firstVariant = shopifyProduct.variants?.edges?.[0]?.node ?? null;

    const product = {
      id: shopifyProduct.id as string,
      handle: shopifyProduct.handle as string,
      title: shopifyProduct.title as string,
      description: (shopifyProduct.description as string) ?? "",
      images: Array.isArray(shopifyProduct.images?.edges)
        ? shopifyProduct.images.edges.map((e: any) => e.node.url)
        : [],
      price: firstVariant ? Number.parseFloat(firstVariant.price.amount) : 0,
      currencyCode: firstVariant?.price?.currencyCode ?? undefined,
      compareAtPrice: firstVariant?.compareAtPrice?.amount
        ? Number.parseFloat(firstVariant.compareAtPrice.amount)
        : undefined,
      compareAtCurrencyCode: firstVariant?.compareAtPrice?.currencyCode ?? undefined,
      variantId: firstVariant?.id ?? undefined,
      tags: shopifyProduct.tags ?? [],
      vendor: shopifyProduct.vendor ?? "",
      productType: shopifyProduct.productType ?? "",
    };

    // Cache to Upstash
    try {
      await redis.set(cacheKey, product, { ex: CACHE_TTL_SECONDS });
    } catch (kvErr) {
      console.warn("[product] Upstash SET failed:", kvErr);
    }

    const headers = new Headers({
      "x-cache": "MISS",
      "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59`,
    });

    return NextResponse.json({ product }, { headers });
  } catch (error) {
    console.error("[product] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
