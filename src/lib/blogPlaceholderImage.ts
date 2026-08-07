import "server-only";
import { prisma } from "@/lib/prisma";

// A tiny, non-cryptographic string hash (djb2) - good enough to turn a
// post's id into a stable index, not for anything security-sensitive.
function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Picks a real property photo to stand in as a blog post's featured image
 * until an admin uploads a real one - every published post should look
 * "finished" on /journal, never a blank grey box. Deterministic per post
 * (hashes `seed`, normally the post id/slug) rather than truly random, so
 * the same post shows the same placeholder on every request/share instead
 * of flickering between images - important since this also feeds og:image.
 */
export async function getPlaceholderImage(seed: string): Promise<string | null> {
  const properties = await prisma.property.findMany({
    where: { featuredImage: { not: null } },
    select: { featuredImage: true },
    orderBy: { createdAt: "asc" },
  });

  const images = properties.map((p) => p.featuredImage).filter((url): url is string => Boolean(url));
  if (images.length === 0) return null;

  return images[hashString(seed) % images.length];
}
