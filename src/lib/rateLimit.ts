import "server-only";

type Bucket = { count: number; resetAt: number };

/**
 * In-memory sliding-window-ish limiter. Good enough for a single-region,
 * low-traffic admin login form; it resets on cold start and isn't shared
 * across serverless instances/regions. If this app grows past a single
 * region or needs a hard guarantee, swap the Map for Upstash Redis
 * (`@upstash/ratelimit`) using the same limit()/key shape below.
 */
const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > max;
}
