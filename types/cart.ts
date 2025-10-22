export interface CartItem {
  id: string
  variantId: string // Added variantId field for Shopify checkout
  title: string
  image: string
  price: number
  quantity: number
  properties?: Record<string, string | number>; // NEW (aka line item properties)
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
}
