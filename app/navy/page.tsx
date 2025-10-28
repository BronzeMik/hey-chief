import { CategoryHero } from "@/components/category-hero";
import { ProductGrid } from "@/components/product-grid";
import { Newsletter } from "@/components/newsletter";
import { Filters } from "@/components/filters";
// Optional: uncomment if you want search on this page, too
// import { SearchBox } from "@/components/search-box";

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

        <div className="mx-auto max-w-7xl px-4 pt-6 space-y-4">
          {/* Optional search for this collection */}
          {/* <SearchBox /> */}

          <div className="md:grid md:grid-cols-12 md:gap-6">
            <aside className="md:col-span-3">
              <Filters />
            </aside>

            <section className="md:col-span-9">
              {/* Fetches the Navy collection once; filters/search happen client-side */}
              <ProductGrid collectionHandle="navy" />
            </section>
          </div>
        </div>

        <Newsletter />
      </main>
    </div>
  );
}
