import { CategoryHero } from "@/components/category-hero";
import { ProductGrid } from "@/components/product-grid";
import { Newsletter } from "@/components/newsletter";
import { Filters } from "@/components/filters";

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

        <div className="mx-auto max-w-7xl px-4 pt-6">
          {/* Mobile: shows a Filters button that opens a modal.
              Desktop (md+): sticky sidebar on the left. */}
          <div className="md:grid md:grid-cols-12 md:gap-6">
            <aside className="md:col-span-3">
              <Filters />
            </aside>

            <section className="md:col-span-9">
              {/* ProductGrid will fetch the collection once and client-filter from URL params */}
              <ProductGrid collectionHandle="hunting-and-fishing-hats" />
            </section>
          </div>
        </div>

        <Newsletter />
      </main>
    </div>
  );
}
