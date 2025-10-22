export interface Product {
  id: string
  variantId: string
  handle: string // Added handle field for product page routing
  title: string
  image: string
  price: number
  category?: string
  description?: string
}
