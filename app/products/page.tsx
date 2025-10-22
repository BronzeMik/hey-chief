import { CategoryHero } from "@/components/category-hero"
import { ProductGrid } from "@/components/product-grid"
import { Newsletter } from "@/components/newsletter"

export default function ShopAllPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <CategoryHero
          title="SHOP ALL CAPS"
          description="Explore our complete collection of premium streetwear caps from all categories"
          backgroundImage="/all-hats-products-hero.png"
          mobileBackgroundImage="/all-hats-products-hero-mobile.png"
        />
        <ProductGrid />
        <Newsletter />
      </main>
    </div>
  )
}
