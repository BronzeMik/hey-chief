import { CategoryHero } from "@/components/category-hero";
import { ProductGrid } from "@/components/product-grid";
import { Newsletter } from "@/components/newsletter";
import { Filters } from "@/components/filters";
// Optional: add search on this page too
// import { SearchBox } from "@/components/search-box";

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
              <Filters />
            </aside>

            <section className="md:col-span-9">
              {/* Fetches the Sports collection once; filters/search happen client-side */}
              <ProductGrid collectionHandle="sports-hats" />
            </section>
          </div>
        </div>

        <Newsletter />
      </main>
    </div>
  );
}
