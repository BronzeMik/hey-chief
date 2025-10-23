"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ProductPageActions } from "@/components/product-page-actions";
import Link from "next/link";

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  variantId: string;
  tags: string[];
  vendor: string;
  productType: string;
}

export default function ProductPageClient({ handle }: { handle: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/product/${encodeURIComponent(handle)}`, {
          cache: "no-store",
        });

        if (res.status === 404) {
          if (!cancelled) setError("Product not found");
          return;
        }

        if (!res.ok) {
          if (!cancelled) setError(`Failed to load product (${res.status})`);
          return;
        }

        const data = (await res.json()) as { product?: Product; error?: string };
        if (!cancelled) {
          if (data?.product) setProduct(data.product);
          else setError("Product not found");
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Unexpected error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    // notFound() is server-only; show a friendly 404 state instead
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
          <p className="text-gray-600 mb-6">
            We couldn’t find a product for “{handle}”.
          </p>
          <Link
            href="/"
            className="inline-block rounded-2xl bg-black px-5 py-3 text-white shadow hover:opacity-90"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-md bg-gray-100"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              {product.vendor && (
                <p className="text-gray-600">By {product.vendor}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
            </div>

            {!!product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.tags?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge className={""} key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <ProductPageActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
