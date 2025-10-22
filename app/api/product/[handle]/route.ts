import { type NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/upstash";
import "server-only";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01"
const CACHE_TTL_SECONDS = 60 * 10;

export async function GET(request: NextRequest, { params }: { params: { handle: string } }) {
  try {
    const handle = params?.handle ?? new URL(request.url).pathname.split("/").pop();
    console.log("[v0] Fetching product with handle:", params.handle)

    if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
      console.error("[v0] Missing Shopify environment variables")
      return NextResponse.json({ error: "Shopify configuration missing" }, { status: 500 })
    }

    const cacheKey = `product:${handle}`;

    // Try Redis first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('------------- Specific Product found in cache -----------------------')
        const headers = new Headers({
          "x-cache": "HIT",
          "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59`,
        });
        return NextResponse.json({ product: cached }, { headers });
      }
    } catch (kvErr) {
      console.warn("[product] Upstash GET failed, continuing to fetch Shopify:", kvErr);
    }

    const query = `
      query getProductByHandle($handle: String!) {
        product(handle: $handle) {
          id
          handle
          title
          description
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                }
                compareAtPrice {
                  amount
                }
              }
            }
          }
          tags
          vendor
          productType
        }
      }
    `

    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle: params.handle },
      }),
    })

    const data = await response.json()
    console.log("[v0] Shopify API response:", data)

    if (data.errors) {
      console.error("[v0] GraphQL errors:", data.errors)
      return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }

    const shopifyProduct = data.data?.product
    if (!shopifyProduct) {
      console.log("[v0] Product not found for handle:", params.handle)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Transform Shopify product to our format
    const product = {
      id: shopifyProduct.id,
      handle: shopifyProduct.handle,
      title: shopifyProduct.title,
      description: shopifyProduct.description,
      images: shopifyProduct.images.edges.map((edge: any) => edge.node.url),
      price: Number.parseFloat(shopifyProduct.variants.edges[0]?.node.price.amount || "0"),
      compareAtPrice: shopifyProduct.variants.edges[0]?.node.compareAtPrice?.amount
        ? Number.parseFloat(shopifyProduct.variants.edges[0].node.compareAtPrice.amount)
        : undefined,
      variantId: shopifyProduct.variants.edges[0]?.node.id,
      tags: shopifyProduct.tags,
      vendor: shopifyProduct.vendor,
      productType: shopifyProduct.productType,
    }

    // Cache to Upstash
    try {
      await redis.set(cacheKey, product, { ex: CACHE_TTL_SECONDS });
    } catch (kvErr) {
      console.warn("[product] Upstash SET failed:", kvErr);
    }

    console.log('---------------- Shopify request for product sent --------------------')

    const headers = new Headers({
      "x-cache": "MISS",
      "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59`,
    });
    return NextResponse.json({ product }, { headers });
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
