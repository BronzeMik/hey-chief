"use client"

import { Button } from "./ui/button"
import { useCart } from "../contexts/cart-context"

interface Product {
  id: string
  handle: string
  title: string
  images: string[] // Updated to match the actual product data structure
  price: number
  variantId: string
}

interface ProductPageActionsProps {
  product: Product
}

export function ProductPageActions({ product }: ProductPageActionsProps) {
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        variantId: product.variantId,
        title: product.title,
        image: product.images[0] || "", // Use first image from images array
        price: product.price,
      },
    })
    dispatch({ type: "OPEN_CART" })
  }

  return (
    <div className="space-y-4">
      <Button
        size="lg"
        className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3"
        onClick={handleAddToCart}
      >
        ADD TO CART - ${product.price}
      </Button>

      <div className="text-sm text-gray-600 space-y-1">
        <p>• Free shipping on orders over $75</p>
        <p>• 30-day return policy</p>
        <p>• Authentic streetwear guaranteed</p>
      </div>
    </div>
  )
}
