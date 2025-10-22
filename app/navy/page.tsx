import { CategoryHero } from "@/components/category-hero"
import { ProductGrid } from "@/components/product-grid"
import { Newsletter } from "@/components/newsletter"

export default function NavyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <CategoryHero
          title="NAVY COLLECTION"
          description="Military-inspired caps with precision craftsmanship and tactical design"
          backgroundImage="/navy-hats-hero.png"
          mobileBackgroundImage="/navy-hats-hero-mobile.png"
        />
        <ProductGrid collectionHandle="navy" />
        <Newsletter />
      </main>
    </div>
  )
}
