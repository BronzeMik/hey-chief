import { CategoryHero } from "@/components/category-hero"
import { ProductGrid } from "@/components/product-grid"
import { Newsletter } from "@/components/newsletter"

export default function SportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <CategoryHero
          title="SPORTS COLLECTION"
          description="Performance caps designed for athletes and sports enthusiasts"
          backgroundImage="/sports-hats-hero.png"
          mobileBackgroundImage="/sports-hats-hero-mobile.png"
        />
        <ProductGrid collectionHandle="sports-hats" />
        <Newsletter />
      </main>
    </div>
  )
}
