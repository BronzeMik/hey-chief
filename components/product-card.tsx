"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

interface ProductCardProps {
  id: string
  handle: string
  title: string
  image: string
  price: number
  onAddToCart: () => void
}

export function ProductCard({ id, handle, title, image, price, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <Link href={`/product/${handle}`}>
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <span className="text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                View Product
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
        </Link>

        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">${price}</span>
            <Button variant={"contained"} onClick={onAddToCart} size="sm" className="bg-black hover:bg-gray-800 text-white font-medium">
              ADD TO CART
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
