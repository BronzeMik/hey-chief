import { CategoryHero } from "@/components/category-hero";
import { ProductGrid } from "@/components/product-grid";
import { Newsletter } from "@/components/newsletter";
import { Filters } from "@/components/filters";
import { Suspense } from "react";

function FiltersFallback() {
  return <div className="md:col-span-3 h-40 rounded-xl border animate-pulse" />;
}

function GridFallback() {
  return (
    <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-60 rounded-xl border animate-pulse" />
      ))}
    </div>
  );
}

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
              <Suspense fallback={<FiltersFallback />}>
              <Filters />
              </Suspense>
            </aside>

            <section className="md:col-span-9">
              <Suspense fallback={<GridFallback />}>
              {/* ProductGrid will fetch the collection once and client-filter from URL params */}
              <ProductGrid collectionHandle="hunting-and-fishing-hats" />
              </Suspense>
            </section>
          </div>
        </div>

        <Newsletter />
      </main>
    </div>
  );
}
