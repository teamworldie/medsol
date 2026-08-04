import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

// Emerging convention (llmstxt.org): a plain-text/Markdown summary of the
// site for LLM crawlers and AI answer engines, listing what the site is and
// linking to its key content - complements sitemap.xml/robots.txt.
export async function GET() {
  const [properties, posts] = await Promise.all([
    prisma.property.findMany({
      where: { slug: { not: null } },
      select: { title: true, slug: true, community: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.blogPost.findMany({
      where: { publishedAt: { not: null } },
      select: { title: true, slug: true, excerpt: true },
      orderBy: { publishedAt: "desc" },
    }),
  ]);

  const propertiesByRoute: Record<string, string> = {
    "Omala Residences": "/omala-residences",
    "Alhama Nature": "/alhama-nature",
    "Corvera Hills": "/corvera",
  };

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    "> Medsol Real Estate offers bespoke luxury villas and residences in Murcia, Spain, across three golf-resort communities: Omala Residences, Alhama Nature, and Corvera Hills.",
    "",
    "## Communities",
    "",
    ...Object.entries(propertiesByRoute).map(([name, route]) => `- [${name}](${SITE_URL}${route})`),
    "",
    "## Properties",
    "",
    ...properties.map((p) => `- [${p.title}](${SITE_URL}/property/${p.slug})${p.community ? ` - ${p.community}` : ""}`),
    "",
    "## Journal",
    "",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/journal/${p.slug})${p.excerpt ? ` - ${p.excerpt}` : ""}`),
    "",
    "## Contact",
    "",
    `- [Contact Medsol](${SITE_URL}/contact)`,
  ];

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
