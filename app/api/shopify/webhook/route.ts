import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  const topic = req.headers.get("x-shopify-topic");
  const body = await req.json();

  if (topic?.startsWith("products/")) {
    revalidateTag("products");
    if (body.handle) revalidateTag(`product:${body.handle}`);
  }

  if (topic?.startsWith("collections/")) {
    revalidateTag("collections");
    if (body.handle) revalidateTag(`collection:${body.handle}`);
  }

  return NextResponse.json({ ok: true });
}
