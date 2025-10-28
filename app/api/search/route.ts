// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

const SEARCH_QUERY = `
  query SearchProducts($first:Int!, $query:String!) {
    products(first:$first, query:$query) {
      edges {
        node {
          id
          handle
          title
          featuredImage { url altText width height }
          priceRange { minVariantPrice { amount currencyCode } }
          metafield(namespace: "custom", key: "color") { value }
          metafield(namespace: "custom", key: "emblem_shape") { value }
          metafield(namespace: "custom", key: "style") { value }
          metafield(namespace: "custom", key: "emblem_color") { value }
        }
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  const term = (req.nextUrl.searchParams.get('q') ?? '').trim();
  if (!term) return NextResponse.json({ items: [] });

  // Combine free text with your base constraints (e.g., only hats)
  const query = `product_type:Hat AND (${term})`;

  const { data } = await shopify<any>(SEARCH_QUERY, { first: 12, query });
  const items = (data?.products?.edges ?? []).map((e: any) => {
    const p = e.node;
    return {
      id: p.id,
      handle: p.handle,
      title: p.title,
      image: p.featuredImage,
      price: p.priceRange?.minVariantPrice,
      color: p.metafield?.value, // this is custom.color if you prefer; see below adapter
      metafields: {
        color: p.metafield?.value, // will remap below on page to exact keys
      },
      // Keep raw for full mapping later:
      _raw: p,
    };
  });

  return NextResponse.json({ items });
}
