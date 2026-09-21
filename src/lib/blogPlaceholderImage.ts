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
 *
 * Draws from every property's full gallery, not just its one featuredImage -
 * with 11 properties but dozens of blog posts, the featuredImage-only pool
 * (11 photos) runs out fast and forces repeats; the combined gallery pool
 * (100+) gives enough headroom that distinct-image assignment holds for a
 * realistic content calendar.
 *
 * `excludeUrls` lets the caller keep this pick distinct from images already
 * assigned to other posts (e.g. on /journal, several cards side by side) -
 * without it, two posts can independently hash to the same photo. Falls
 * back to allowing a repeat only once every image is already taken.
 */
export async function getPlaceholderImage(seed: string, excludeUrls: string[] = []): Promise<string | null> {
  const properties = await prisma.property.findMany({
    select: { featuredImage: true, images: true },
    orderBy: { createdAt: "asc" },
  });

  const allImages: string[] = [];
  for (const property of properties) {
    if (property.featuredImage) allImages.push(property.featuredImage);
    if (property.images) {
      try {
        const gallery = JSON.parse(property.images) as string[];
        if (Array.isArray(gallery)) allImages.push(...gallery.filter((url) => typeof url === "string"));
      } catch {
        // Malformed JSON on a property record - skip its gallery, featuredImage above still counts.
      }
    }
  }
  const uniqueImages = Array.from(new Set(allImages));
  if (uniqueImages.length === 0) return null;

  const excluded = new Set(excludeUrls);
  const available = uniqueImages.filter((url) => !excluded.has(url));
  const pool = available.length > 0 ? available : uniqueImages;

  return pool[hashString(seed) % pool.length];
}
