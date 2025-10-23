// app/product/[handle]/page.tsx
import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

type Params = { handle: string };

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { handle } = await params; // Next 15 async props
  return <ProductPageClient handle={handle} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { handle } = await params;
  return {
    title: `Product – ${handle}`,
    description: `Details for product "${handle}".`,
  };
}
