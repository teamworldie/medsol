import "server-only";
import { prisma } from "@/lib/prisma";

export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, publishedAt: { not: null } },
  });
}
