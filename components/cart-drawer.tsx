"use client"

import { useCart } from "../contexts/cart-context"
import { Button } from "./ui/button"
import { X, Plus, Minus, ShoppingBag, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

export function CartDrawer() {
  const { state, dispatch } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<{
    message: string
    type?: string
    soldOutItems?: Array<{ message: string; field: any }>
  } | null>(null)

  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [state.isOpen])

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    setCheckoutError(null)

    try {
      console.log("[v0] Cart items before checkout:", state.items)

      const formattedItems = state.items.map((item) => ({
        id: item.id,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
        properties: item.properties || {},
      }))

      console.log("[v0] Formatted items for checkout:", formattedItems)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: formattedItems,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[v0] Checkout API error:", errorData)

        if (errorData.type === "SOLD_OUT") {
          setCheckoutError({
            message: errorData.error,
            type: errorData.type,
            soldOutItems: errorData.soldOutItems,
          })
          return
        }

        throw new Error(errorData.error || "Failed to create checkout")
      }

      const { checkoutUrl } = await response.json()
      console.log("[v0] Checkout URL received:", checkoutUrl)

      window.location.href = checkoutUrl
    } catch (error) {
      console.error("[v0] Checkout error:", error)
      setCheckoutError({
        message: `Failed to proceed to checkout: ${error.message}`,
        type: "GENERAL_ERROR",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const removeSoldOutItems = () => {
    if (checkoutError?.soldOutItems) {
      checkoutError.soldOutItems.forEach((soldOutItem) => {
        const productName = soldOutItem.message.match(/'([^']+)'/)?.[1]
        if (productName) {
          const itemToRemove = state.items.find((item) => item.title.toLowerCase().includes(productName.toLowerCase()))
          if (itemToRemove) {
            removeItem(itemToRemove.id)
          }
        }
      })
    }
    setCheckoutError(null)
  }

  if (!state.isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={closeCart} />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl transform transition-transform flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({state.totalItems})
          </h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {checkoutError && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 mb-2">{checkoutError.message}</p>
                {checkoutError.type === "SOLD_OUT" && checkoutError.soldOutItems && (
                  <div className="space-y-2">
                    <p className="text-xs text-red-700">The following items are no longer available:</p>
                    <ul className="text-xs text-red-700 list-disc list-inside space-y-1">
                      {checkoutError.soldOutItems.map((item, index) => (
                        <li key={index}>{item.message}</li>
                      ))}
                    </ul>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={removeSoldOutItems}
                        className="text-xs bg-transparent"
                      >
                        Remove Sold Out Items
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setCheckoutError(null)} className="text-xs">
                        Keep Items
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={closeCart} variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.title}</h3>
                    {/* <p className="text-sm font-semibold text-primary">${item.price}</p> */}
                      <p className="text-sm font-semibold text-primary">
    ${Number(item.price).toFixed(2)}
  </p>

  {/* Show customizations if present */}
  {item.properties && (
    <div className="mt-2 space-y-1">
      {Object.entries(item.properties).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{key}:</span>
          {/* If the value looks like a hex color, show a swatch */}
          {typeof value === 'string' && /^#([0-9a-f]{3}){1,2}$/i.test(value) ? (
            <span className="inline-flex items-center gap-2">
              <span
                aria-label={value}
                title={value}
                className="inline-block w-3.5 h-3.5 rounded-full border"
                style={{ backgroundColor: value as string }}
              />
              <span>{value}</span>
            </span>
          ) : (
            <span>{String(value)}</span>
          )}
        </div>
      ))}
    </div>
  )}

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 bg-transparent"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-red-500 hover:text-red-700 text-xs"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>${state.totalPrice.toFixed(2)}</span>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? "Creating Checkout..." : "Checkout"}
            </Button>

            <Button variant="outline" className="w-full bg-transparent" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
