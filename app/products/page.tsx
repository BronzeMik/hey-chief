// app/products/page.tsx
import { CategoryHero } from "@/components/category-hero";
import { ProductGrid } from "@/components/product-grid";
import { Newsletter } from "@/components/newsletter";
import { SearchBox } from "@/components/search-box";
import { Filters } from "@/components/filters";

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
          <SearchBox />

          {/* Mobile: Filters button + modal; Desktop: Sidebar */}
          <div className="md:grid md:grid-cols-12 md:gap-6">
            <aside className="md:col-span-3">
              <Filters />
            </aside>
            <section className="md:col-span-9">
              <ProductGrid />
            </section>
          </div>
        </div>

        <Newsletter />
      </main>
    </div>
  );
}
