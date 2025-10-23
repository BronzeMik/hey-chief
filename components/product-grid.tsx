"use client"

import { ProductCard } from "@/components/product-card"
import type { Product } from "@/types/product"
import { useEffect, useState } from "react"
import { useCart } from "@/contexts/cart-context"

interface ProductGridProps {
  category?: string
  collectionHandle?: string
  title?: string
  amount?: number
  start?: number
  end?: number
}

export function ProductGrid({ category, collectionHandle, title, amount, start = 0, end }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { dispatch } = useCart()

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true

    // keep a short delay so very fast requests don't flash the animation
    const overlayDelay = 100
    let startTimer = window.setTimeout(() => {
      if (mounted) setLoading(true)
    }, overlayDelay)

    const fetchProducts = async () => {
      try {
        setLoading(true)
        let url = "/api/products"
        if (collectionHandle) {
          url = `/api/collections/${collectionHandle}`
        } else if (category) {
          url = `/api/products?category=${category}`
        }

        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch products: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        if (end) {
          setProducts(data.products.slice(start, end))
        } else {
          setProducts(data.products)
        }
      } catch (err) {
        if (!mounted) return
        console.error("Shopify Product fetch error:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        if (!mounted) return
        setLoading(false)
        clearTimeout(startTimer)
      }
    }

    fetchProducts()

    return () => {
      mounted = false
      controller.abort()
      clearTimeout(startTimer)
    }
  }, [category, collectionHandle, start, end])

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        variantId: product.variantId,
        title: product.title,
        image: product.image,
        price: product.price,
      },
    })
    dispatch({ type: "OPEN_CART" })
  }

  // how many skeletons to show while loading (matches grid density)
  const skeletonCount = Math.max(4, amount ?? 8)

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* subtle top progress bar (only visible while loading) */}
        <div className="relative">
          {loading && (
            <div aria-hidden className="absolute left-0 right-0 top-0 z-10">
              <div className="h-1 w-full overflow-hidden bg-transparent">
                <div className="progress-runner" />
              </div>
            </div>
          )}
        </div>

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title ? title : ( 
              <>
              {collectionHandle
              ? `${collectionHandle.toUpperCase().replace("-", " & ")} COLLECTION`
              : category
                ? `${category.toUpperCase().replace("-", " & ")} COLLECTION`
                : "ALL PRODUCTS"}
            </>
          )}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {!collectionHandle && !category
              ? "Browse our complete collection of premium streetwear caps from all categories"
              : "Discover our latest streetwear caps, designed to honor the proud spirit of the U.S. Navy."}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* show skeletons while loading to mimic real content layout */}
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-pulse">
                  <div className="bg-gray-200/40 rounded-lg overflow-hidden">
                    {/* image skeleton */}
                    <div className="w-full h-56 sm:h-64 md:h-48 lg:h-56 relative overflow-hidden">
                      <div className="shimmer absolute inset-0" />
                    </div>

                    {/* body */}
                    <div className="p-4">
                      <div className="h-4 bg-gray-200/40 rounded w-3/4 mb-3 shimmer-text" />
                      <div className="h-3 bg-gray-200/40 rounded w-1/2 mb-4 shimmer-text" />
                      <div className="h-9 bg-gray-200/30 rounded w-1/3 shimmer-text" />
                    </div>
                  </div>
                </div>
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  handle={product.handle}
                  title={product.title}
                  image={product.image}
                  price={product.price}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
        </div>

        {/* Empty / Error states shown inside the page */}
        {!loading && products.length === 0 && !error && (
          <div className="text-center mt-8">
            <p className="text-lg">No products found.</p>
          </div>
        )}

        {error && (
          <div className="text-center mt-8">
            <p className="text-lg text-red-500">No Products Available — {error}</p>
          </div>
        )}
      </div>

      {/* shimmer + subtle animations styles */}
      <style jsx>{`
        /* thin progress bar runner - short animated sweep */
        .progress-runner {
          width: 30%;
          height: 4px;
          background: linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.28), rgba(255,255,255,0.12));
          transform: translateX(-110%);
          animation: progressMove 1.4s cubic-bezier(.2,.8,.2,1) infinite;
          box-shadow: 0 1px 6px rgba(0,0,0,0.2);
        }
        @keyframes progressMove {
          0% { transform: translateX(-110%); opacity: 0.3 }
          50% { transform: translateX(20%); opacity: 1 }
          100% { transform: translateX(120%); opacity: 0.3 }
        }

        /* shimmer layer across image */
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%);
          transform: translateX(-100%);
          animation: shimmerMove 1.2s linear infinite;
        }
        @keyframes shimmerMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* lighter shimmer for text blocks */
        .shimmer-text {
          position: relative;
          overflow: hidden;
        }
        .shimmer-text::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.00) 100%);
          transform: translateX(-100%);
          animation: shimmerMove 1.2s linear infinite;
        }
      `}</style>
    </section>
  )
}
