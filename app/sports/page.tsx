import { CategoryHero } from "@/components/category-hero";
import { ProductGrid } from "@/components/product-grid";
import { Newsletter } from "@/components/newsletter";
import { Filters } from "@/components/filters";
// Optional: add search on this page too
// import { SearchBox } from "@/components/search-box";
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

        <div className="mx-auto max-w-7xl px-4 pt-6 space-y-4">
          {/* Optional search for this collection */}
          {/* <SearchBox /> */}

          <div className="md:grid md:grid-cols-12 md:gap-6">
            <aside className="md:col-span-3">
              <Suspense fallback={<FiltersFallback />}>
              <Filters />
              </Suspense>
            </aside>

            <section className="md:col-span-9">
              {/* Fetches the Sports collection once; filters/search happen client-side */}
              <Suspense fallback={<GridFallback />}>
              <ProductGrid collectionHandle="sports-hats" />
              </Suspense>
            </section>
          </div>
        </div>

        <Newsletter />
      </main>
    </div>
  );
}
