import { NextResponse } from "next/server"
import "server-only"

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!
const API = process.env.SHOPIFY_API_VERSION ?? "2024-07"
const ENDPOINT = `https://${DOMAIN}/api/${API}/graphql.json`

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!], $buyer: CartBuyerIdentityInput)
  @inContext(country: US, language: EN) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyer }) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`

const VARIANT_FROM_PRODUCT = /* GraphQL */ `
  query VariantFromProduct($id: ID!) @inContext(country: US, language: EN) {
    node(id: $id) { ... on Product { variants(first: 1) { nodes { id } } } }
  }
`

const VARIANT_FROM_HANDLE = /* GraphQL */ `
  query VariantFromHandle($handle: String!) @inContext(country: US, language: EN) {
    product(handle: $handle) { variants(first: 1) { nodes { id } } }
  }
`

async function sf<T>(query: string, variables: Record<string, any>) {
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  })
  const j = await r.json()
  if (!r.ok || j.errors) {
    const msg = j.errors?.map((e: any) => e.message).join("; ") || r.statusText
    throw new Error(`Shopify error: ${msg}`)
  }
  return j.data as T
}

function isVariantGID(x: string) {
  return x?.startsWith("gid://shopify/ProductVariant/")
}
function isProductGID(x: string) {
  return x?.startsWith("gid://shopify/Product/")
}

async function resolveVariantId(item: any): Promise<string> {
  // already variant?
  if (item.variantId) {
    const v = String(item.variantId).trim()
    if (isVariantGID(v)) return v
    if (!v.startsWith("gid://")) return `gid://shopify/ProductVariant/${v}` // bare numeric variant id
    throw new Error("variantId must be a ProductVariant GID")
  }
  // product gid?
  if (item.productId) {
    const p = String(item.productId).trim()
    if (!isProductGID(p)) throw new Error("productId must be a Product GID")
    const data = await sf<{ node?: { variants?: { nodes: { id: string }[] } } }>(VARIANT_FROM_PRODUCT, { id: p })
    const vid = data.node?.variants?.nodes?.[0]?.id
    if (!vid) throw new Error(`No variants for productId ${p}`)
    return vid
  }
  // handle?
  if (item.handle) {
    const h = String(item.handle).trim()
    const data = await sf<{ product?: { variants?: { nodes: { id: string }[] } } }>(VARIANT_FROM_HANDLE, { handle: h })
    const vid = data.product?.variants?.nodes?.[0]?.id
    if (!vid) throw new Error(`No variants for handle ${h}`)
    return vid
  }
  // legacy id?
  if (item.id) {
    const raw = String(item.id).trim()
    if (isVariantGID(raw)) return raw
    if (isProductGID(raw)) {
      const data = await sf<{ node?: { variants?: { nodes: { id: string }[] } } }>(VARIANT_FROM_PRODUCT, { id: raw })
      const vid = data.node?.variants?.nodes?.[0]?.id
      if (!vid) throw new Error(`No variants for product id ${raw}`)
      return vid
    }
    return `gid://shopify/ProductVariant/${raw}` // treat as bare variant id
  }
  throw new Error("Each item needs one of: variantId, productId, handle, or id")
}

export async function POST(req: Request) {
  try {
    console.log("[v0] Checkout API - Environment check:", {
      hasDomain: !!DOMAIN,
      hasToken: !!TOKEN,
      apiVersion: API,
    })

    if (!DOMAIN || !TOKEN) {
      console.error("[v0] Missing Shopify environment variables")
      return NextResponse.json({ error: "Missing Shopify env vars" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    console.log("[v0] Checkout request body:", body)

    const items = Array.isArray(body?.items) ? body.items : []
    if (!items.length) {
      console.error("[v0] No items provided in checkout request")
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    console.log("[v0] Processing items for checkout:", items)

    // Resolve all items to variant (merchandise) IDs
    const lines = []
    for (let i = 0; i < items.length; i++) {
      console.log(`[v0] Resolving variant for item ${i}:`, items[i])

      try {
        const variantId = await resolveVariantId(items[i])
        const quantity = Number(items[i].quantity ?? 1)
        if (!(quantity >= 1)) {
          console.error(`[v0] Invalid quantity for item ${i}:`, quantity)
          return NextResponse.json({ error: `items[${i}].quantity must be >= 1` }, { status: 400 })
        }
        // lines.push({ merchandiseId: variantId, quantity })
        lines.push({
          merchandiseId: variantId,
          quantity,
          // pass customizations as line item properties → shows under the item in checkout
          attributes: Array.isArray(items[i].attributes) // if you already pass attributes, keep them
            ? items[i].attributes
            : items[i].properties
              ? Object.entries(items[i].properties).map(([key, value]) => ({ key, value: String(value) }))
              : [],
        })
        console.log(`[v0] Resolved item ${i} to variant:`, variantId)
      } catch (variantError) {
        console.error(`[v0] Failed to resolve variant for item ${i}:`, variantError)
        throw variantError
      }
    }

    console.log("[v0] Final cart lines:", lines)

    // Optional: accept buyerIdentity (email, countryCode, customerAccessToken, etc.)
    const buyer = body?.buyerIdentity

    // Create cart → get checkoutUrl
    console.log("[v0] Creating Shopify cart with lines:", lines)
    const data = await sf<{ cartCreate: any }>(CART_CREATE, { lines, buyer })
    console.log("[v0] Shopify cart creation response:", data)

    const out = data.cartCreate
    if (out.userErrors?.length) {
      console.error("[v0] Shopify cart creation errors:", out.userErrors)

      const soldOutErrors = out.userErrors.filter(
        (error: any) =>
          error.message.toLowerCase().includes("sold out") || error.message.toLowerCase().includes("out of stock"),
      )

      if (soldOutErrors.length > 0) {
        return NextResponse.json(
          {
            error: "Some items in your cart are no longer available",
            type: "SOLD_OUT",
            details: out.userErrors,
            soldOutItems: soldOutErrors.map((error: any) => ({
              message: error.message,
              field: error.field,
            })),
          },
          { status: 400 },
        )
      }

      return NextResponse.json(
        {
          error: out.userErrors[0].message,
          type: "CHECKOUT_ERROR",
          details: out.userErrors,
        },
        { status: 400 },
      )
    }

    console.log("[v0] Checkout successful, returning URL:", out.cart.checkoutUrl)
    return NextResponse.json({
      cartId: out.cart.id,
      checkoutUrl: out.cart.checkoutUrl,
    })
  } catch (e: any) {
    console.error("[v0] Checkout init error:", e?.message || e)
    return NextResponse.json({ error: e?.message || "Checkout init failed" }, { status: 400 })
  }
}
