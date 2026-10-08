import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "/omala-residences",
  "/alhama-nature",
  "/corvera",
  "/santa-rosalia",
  "/serena-breeze",
  "/journal",
  "/insider",
  "/guides/buyers-guide",
  "/guides/golf-home-guide",
  "/contact",
  "/privacy-policy",
  "/cookies",
  "/legal-info",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, posts] = await Promise.all([
    prisma.property.findMany({ where: { slug: { not: null } }, select: { slug: true, updatedAt: true } }),
    // `lte: now` keeps scheduled (future-dated) posts out of the sitemap -
    // they 404 on the public site until their publish time, and listing them
    // early caused "Not found" errors in Search Console.
    prisma.blogPost.findMany({ where: { publishedAt: { not: null, lte: new Date() } }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const propertyEntries: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${SITE_URL}/property/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/journal/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticEntries, ...propertyEntries, ...postEntries];
}
