// app/products/page.tsx
import { CategoryHero } from "@/components/category-hero";
import { ProductGrid } from "@/components/product-grid";
import { Newsletter } from "@/components/newsletter";
import { SearchBox } from "@/components/search-box";
import { Filters } from "@/components/filters";
import { Suspense } from "react";

function SearchFallback() {
  return <div className="h-10 w-full max-w-xl rounded-lg border animate-pulse" />;
}

function FiltersFallback() {
  return <div className="md:col-span-3 h-40 rounded-xl border animate-pulse" />;
}

function GridFallback() {
  return (
    <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-60 rounded-xl border animate-pulse" />
      ))}
    </div>
  );
}

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

        <div className="mx-auto max-w-7xl px-4 pt-6 space-y-4">
          {/* Search (uses useSearchParams) */}
          <Suspense fallback={<SearchFallback />}>
            <SearchBox />
          </Suspense>

          {/* Filters + Grid (both use useSearchParams) */}
          <div className="md:grid md:grid-cols-12 md:gap-6">
            <aside className="md:col-span-3">
              <Suspense fallback={<FiltersFallback />}>
                <Filters />
              </Suspense>
            </aside>

            <section className="md:col-span-9">
              <Suspense fallback={<GridFallback />}>
                <ProductGrid />
              </Suspense>
            </section>
          </div>
        </div>

        <Newsletter />
      </main>
    </div>
  );
}
