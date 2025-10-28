// lib/shopify.ts (server-only)
export async function shopify<T>(query: string, variables?: Record<string, any>) {
  const res = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store', // search should be fresh
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}
