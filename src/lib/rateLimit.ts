import "server-only";
import { Redis } from "@upstash/redis";

type Bucket = { count: number; resetAt: number };

// Fallback for local dev / environments without Upstash configured. Not
// shared across instances - fine for a single dev server, not for prod.
const memoryBuckets = new Map<string, Bucket>();

function isRateLimitedInMemory(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > max;
}

let cachedRedis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  cachedRedis = url && token ? new Redis({ url, token }) : null;
  return cachedRedis;
}

/**
 * Shared-across-instances rate limiter backed by Upstash Redis (REST API,
 * works from Vercel's serverless/edge runtimes with no persistent
 * connection). Falls back to an in-memory bucket - reset on cold start,
 * not shared across instances - when Upstash isn't configured, so local
 * dev keeps working with zero setup.
 */
export async function isRateLimited(key: string, max: number, windowMs: number): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return isRateLimitedInMemory(key, max, windowMs);

  const redisKey = `ratelimit:${key}`;
  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.pexpire(redisKey, windowMs);
  }
  return count > max;
}
