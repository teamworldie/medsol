// Single place to set your agency's name. Used in generated SEO titles/
// descriptions and transactional emails (password reset, etc).
export const SITE_NAME = "Medsol Real Estate";

// Canonical site URL - used for sitemap.xml, robots.txt, llms.txt, share
// links, and metadata (canonical/OG URLs). Reads NEXT_PUBLIC_SITE_URL so
// this can be repointed without a code change if the domain setup changes -
// falls back to the connected production domain.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.medsolrealestate.com";

// Many stored seoTitle values (properties, blog posts) already have
// " | Medsol Real Estate" baked in from when they were written, but the
// root layout's title template ("%s | Medsol Real Estate") appends it again
// to every page title - producing a doubled suffix. Strip it here at render
// time rather than editing the stored data, since seoTitle is reused as-is
// elsewhere (e.g. as a seoDescription fallback).
export function stripSiteNameSuffix(title: string): string {
  const suffix = ` | ${SITE_NAME}`;
  return title.toLowerCase().endsWith(suffix.toLowerCase()) ? title.slice(0, -suffix.length) : title;
}
