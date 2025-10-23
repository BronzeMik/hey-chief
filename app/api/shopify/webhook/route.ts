// app/api/webhooks/shopify/route.ts (example path)
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  // Headers can vary in case depending on platform/proxy
  const topic = req.headers.get("x-shopify-topic") || req.headers.get("X-Shopify-Topic") || "";

  // If body isn't JSON, this will throw — catch to ensure 200s for Shopify
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  // Basic fan-out — await is optional, but explicit is nice
  if (topic.startsWith("products/")) {
    await revalidateTag("products");
    if (body?.handle) await revalidateTag(`product:${body.handle}`);
  }

  if (topic.startsWith("collections/")) {
    await revalidateTag("collections");
    if (body?.handle) await revalidateTag(`collection:${body.handle}`);
  }

  return NextResponse.json({ ok: true });
}
