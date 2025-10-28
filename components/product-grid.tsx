"use client";

import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";

/** ---- Tolerant matching helpers (mirror the API version) ---- */
function normalizeUnicode(v: string) {
  // dashes -> "-", weird spaces -> " "
  const DASHES = /[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g;
  const SPACES = /[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;
  return v.replace(DASHES, "-").replace(SPACES, " ");
}
function norm(v?: string | null) {
  if (!v) return "";
  return normalizeUnicode(v).trim().toLowerCase();
}
function variantsFor(v: string): string[] {
  const n = normalizeUnicode(v);
  const oneSpace = n.replace(/\s+/g, " ").trim();
  const withSpaces = oneSpace.replace(/-/g, " ");     // flat top hexagon
  const withHyphens = oneSpace.replace(/\s+/g, "-");  // flat-top-hexagon
  return Array.from(new Set([oneSpace, withSpaces, withHyphens]));
}
function matchesFacet(value: string | null | undefined, selected: string[]): boolean {
  if (!selected.length) return true; // no filter -> pass
  const v = norm(value);
  if (!v) return false;
  // build tolerant candidate set for the product value too
  const productCandidates = variantsFor(v);
  // selected list: any match wins
  return selected.some(sel => {
    const selCandidates = variantsFor(sel.toLowerCase());
    // intersect candidate sets
    return selCandidates.some(sc => productCandidates.includes(sc));
  });
}
function tokens(str: string) {
  return norm(str).split(/\s+/).filter(Boolean);
}
function matchesSearch(p: Product, q: string): boolean {
  const t = q.trim();
  if (!t) return true;
  const qs = tokens(t);
  const hay = [
    p.title,
    p.handle,
    (p as any).tags?.join(" "),
    (p as any).color,
    (p as any).style,
    (p as any).emblemColor,
    (p as any).emblemShape,
  ]
    .map(norm)
    .join(" ");
  // require all tokens to appear
  return qs.every(tok => hay.includes(tok));
}
/** ------------------------------------------------------------ */

interface ProductGridProps {
  category?: string;
  collectionHandle?: string;
  title?: string;
  amount?: number;
  start?: number;
  end?: number;
  cta?: string;
}

export function ProductGrid({
  category,
  collectionHandle,
  title,
  amount,
  start = 0,
  end,
  cta
}: ProductGridProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useCart();
  const searchParams = useSearchParams();

  // 1) Fetch UNFILTERED list once (or by category/collection)
  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const overlayDelay = 100;
    const startTimer = window.setTimeout(() => mounted && setLoading(true), overlayDelay);

    (async () => {
      try {
        setLoading(true);
        let url: string;
        if (collectionHandle) {
          url = `/api/collections/${collectionHandle}`;
        } else if (category) {
          url = `/api/products?category=${encodeURIComponent(category)}`;
        } else {
          url = `/api/products`; // ← no filters; we’ll filter client-side
        }
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`${res.status} - ${await res.text()}`);
        const data = await res.json();
        setAllProducts(data.products ?? []);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        console.error("Product fetch error:", e);
        setError(e instanceof Error ? e.message : "An error occurred");
      } finally {
        if (!mounted) return;
        setLoading(false);
        clearTimeout(startTimer);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
      clearTimeout(startTimer);
    };
  }, [category, collectionHandle]);

  // 2) Read current URL facets/search (multi-select comma lists)
  const selected = useMemo(() => {
    const getList = (k: string) => {
      const raw = searchParams.get(k);
      if (!raw) return [];
      return raw.split(",").map(s => s.trim()).filter(Boolean);
    };
    return {
      q: searchParams.get("q") ?? "",
      color: getList("color"),
      style: getList("style"),
      emblem_color: getList("emblem_color"),
      emblem_shape: getList("emblem_shape"),
    };
  }, [searchParams]);

  // 3) Apply client-side filtering
  const filtered = useMemo(() => {
    const list = allProducts.filter((p: any) => {
      // Each product coming from /api/products already includes these metafields
      const okColor = matchesFacet(p.color, selected.color);
      const okStyle = matchesFacet(p.style, selected.style);
      const okEmblemColor = matchesFacet(p.emblemColor, selected.emblem_color);
      const okEmblemShape = matchesFacet(p.emblemShape, selected.emblem_shape);
      const okSearch = matchesSearch(p, selected.q);
      return okColor && okStyle && okEmblemColor && okEmblemShape && okSearch;
    });
    // Optional: keep your existing slicing behavior
    return typeof end === "number" ? list.slice(start, end) : list;
  }, [allProducts, selected, start, end]);

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        variantId: (product as any).variantId,
        title: product.title,
        image: (product as any).image,
        price: (product as any).price,
      },
    });
    dispatch({ type: "OPEN_CART" });
  };

  const skeletonCount = Math.max(4, amount ?? 8);

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title
              ? title
              : collectionHandle
              ? `${collectionHandle.toUpperCase().replace("-", " & ")} COLLECTION`
              : category
              ? `${category.toUpperCase().replace("-", " & ")} COLLECTION`
              : "ALL PRODUCTS"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {!collectionHandle && !category
              ? "Browse our complete collection of premium streetwear caps from all categories"
              : "Discover our latest streetwear caps, designed to honor the proud spirit of the U.S. Navy."}
          </p>
          {cta && <Link href={`${cta}`}>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-black text-white hover:text-gray-800 text-sm cursor-pointer my-5"
                    >
                      View Similar Products
                    </Button>
                  </Link>
          }
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-pulse">
                  <div className="bg-gray-200/40 rounded-lg overflow-hidden">
                    <div className="w-full h-56 sm:h-64 md:h-48 lg:h-56 relative overflow-hidden">
                      <div className="shimmer absolute inset-0" />
                    </div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200/40 rounded w-3/4 mb-3 shimmer-text" />
                      <div className="h-3 bg-gray-200/40 rounded w-1/2 mb-4 shimmer-text" />
                      <div className="h-9 bg-gray-200/30 rounded w-1/3 shimmer-text" />
                    </div>
                  </div>
                </div>
              ))
            : filtered.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  handle={product.handle}
                  title={product.title}
                  image={product.image}
                  price={product.price}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
        </div>

        {!loading && filtered.length === 0 && !error && (
          <div className="text-center mt-8">
            <p className="text-lg">No products found.</p>
          </div>
        )}
        {error && (
          <div className="text-center mt-8">
            <p className="text-lg text-red-500">No Products Available — {error}</p>
          </div>
        )}
      </div>

      {/* shimmer styles */}
      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.02) 0%,
            rgba(255, 255, 255, 0.06) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          transform: translateX(-100%);
          animation: shimmerMove 1.2s linear infinite;
        }
        @keyframes shimmerMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-text { position: relative; overflow: hidden; }
        .shimmer-text::after {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.06) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-100%);
          animation: shimmerMove 1.2s linear infinite;
        }
      `}</style>
    </section>
  );
}
