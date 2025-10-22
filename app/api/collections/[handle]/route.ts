import { type NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/upstash";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01"
const CACHE_TTL_SECONDS = 60 * 10;

export async function GET(request: NextRequest, { params }: { params: { handle: string } }) {
  try {
    if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
      return NextResponse.json({ error: "Shopify configuration missing" }, { status: 500 })
    }

    const { handle } = await params
    const cacheKey = `collection:${handle}`;

    // Try Redis first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('------------- Cache request send --------------')
        const headers = new Headers({
          "x-cache": "HIT",
          "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59`,
        });
        return NextResponse.json({ products: cached }, { headers });
      }
    } catch (err) {
      console.warn(`[collection:${handle}] Upstash GET failed:`, err);
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
                images(first: 1) {
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
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle },
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      console.error("GraphQL errors:", data.errors)
      throw new Error("GraphQL query failed")
    }

    if (!data.data.collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    // Transform Shopify data to match our Product type
    const products = data.data.collection.products.edges.map((edge: any) => {
      const product = edge.node
      const firstImage = product.images.edges[0]?.node
      const firstVariant = product.variants.edges[0]?.node

      return {
        id: product.id,
        variantId: firstVariant?.id || product.id,
        title: product.title,
        handle: product.handle,
        image: firstImage?.url || "/streetwear-cap.png",
        price: firstVariant ? Number.parseFloat(firstVariant.price.amount) : 0,
      }
    })

    // Store in Redis
    try {
      await redis.set(cacheKey, products, { ex: CACHE_TTL_SECONDS });
    } catch (err) {
      console.warn(`[collection:${handle}] Upstash SET failed:`, err);
    }

    const headers = new Headers({
      "x-cache": "MISS",
      "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=59`,
    });
    console.log('-------------Shopify request sent ---------------')
    return NextResponse.json({ products }, { headers });
  } catch (error) {
    console.error("Collection API error:", error)
    return NextResponse.json({ error: "Failed to fetch collection products" }, { status: 500 })
  }
}
