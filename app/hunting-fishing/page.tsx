import { CategoryHero } from "@/components/category-hero"
import { ProductGrid } from "@/components/product-grid"
import { Newsletter } from "@/components/newsletter"

export default function HuntingFishingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <CategoryHero
          title="HUNTING & FISHING"
          description="Rugged caps built for outdoor adventures and wilderness exploration"
          backgroundImage="/hunting-fishing-hero.png"
          mobileBackgroundImage="/hunting-fishing-hero-mobile.png"
        />
        <ProductGrid collectionHandle="hunting-and-fishing-hats" />
        <Newsletter />
      </main>
    </div>
  )
}
