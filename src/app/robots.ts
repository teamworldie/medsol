import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

// Known AI crawlers listed explicitly: some default to conservative
// behavior without an explicit allow rule, and being crawlable by these is
// the whole point of the GEO/AEO content plan this supports.
const AI_CRAWLERS = ["GPTBot", "ChatGPT-User", "Google-Extended", "PerplexityBot", "ClaudeBot", "anthropic-ai", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/admin", "/api"] })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
