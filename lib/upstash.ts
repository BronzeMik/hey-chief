import { Redis } from "@upstash/redis";


if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  // We don't throw here so local dev environments can still run parts of the app,
  // but it's helpful to log for debugging.
  console.warn("Upstash env not found: KV_REST_API_URL or KV_REST_API_TOKEN missing");
}

export const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
});
