// lib/cart-helpers.ts
export function stableKeyFromProps(props?: Record<string, string | number>) {
  if (!props) return '';
  const entries = Object.entries(props).sort(([a], [b]) => a.localeCompare(b));
  return JSON.stringify(entries);
}

export function makeLineId(variantId: string, props?: Record<string, string | number>) {
  return `${variantId}::${stableKeyFromProps(props)}`;
}
