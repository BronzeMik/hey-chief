"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ProductPageActions } from "@/components/product-page-actions"

interface Product {
  id: string
  handle: string
  title: string
  description: string
  images: string[]
  price: number
  compareAtPrice?: number
  variantId: string
  tags: string[]
  vendor: string
  productType: string
}

export default function ProductPage({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        console.log("[v0] Fetching product on client:", params.handle)
        const response = await fetch(`/api/product/${params.handle}`)

        console.log("[v0] Response status:", response.status)

        if (!response.ok) {
          console.log("[v0] Response not ok:", response.statusText)
          setError(true)
          return
        }

        const data = await response.json()
        console.log("[v0] Product data received:", data)
        setProduct(data.product)
      } catch (error) {
        console.error("[v0] Error fetching product:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.handle])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-gray-600">{product.vendor}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">${product.compareAtPrice}</span>
              )}
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <ProductPageActions product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
