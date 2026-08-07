// Single place to set your agency's name. Used in generated SEO titles/
// descriptions and transactional emails (password reset, etc).
export const SITE_NAME = "Medsol Real Estate";

// Canonical site URL - used for sitemap.xml, robots.txt, llms.txt, share
// links, and metadata (canonical/OG URLs). Reads NEXT_PUBLIC_SITE_URL so
// this can be repointed without a code change if the domain setup changes -
// falls back to the connected production domain.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.medsolrealestate.com";
