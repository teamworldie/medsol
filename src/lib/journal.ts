import "server-only";
import { prisma } from "@/lib/prisma";

// A post with a future publishedAt is scheduled, not live yet - `lte: now`
// is what actually enforces that (an earlier version only checked `not:
// null`, so a scheduled post would appear on the public site immediately
// instead of waiting for its scheduled time).
function publishedWhere() {
  return { publishedAt: { not: null, lte: new Date() } };
}

export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: publishedWhere(),
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, ...publishedWhere() },
  });
}

export async function getRelatedPosts(slug: string, category: string | null, limit = 3) {
  const sameCategory = category
    ? await prisma.blogPost.findMany({
        where: { ...publishedWhere(), category, slug: { not: slug } },
        orderBy: { publishedAt: "desc" },
        take: limit,
      })
    : [];

  if (sameCategory.length >= limit) return sameCategory;

  // Backfill with the most recent other posts if the category doesn't have enough.
  const fill = await prisma.blogPost.findMany({
    where: {
      ...publishedWhere(),
      slug: { notIn: [slug, ...sameCategory.map((p) => p.slug)] },
    },
    orderBy: { publishedAt: "desc" },
    take: limit - sameCategory.length,
  });

  return [...sameCategory, ...fill];
}
