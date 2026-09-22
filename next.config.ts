import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// No CORS headers are configured intentionally: the API routes and Server
// Actions are only ever called same-origin from this app. If a future
// external client (mobile app, partner integration) needs to call
// /api/media/upload directly, add an explicit, narrowly-scoped
// Access-Control-Allow-Origin for that route rather than a blanket policy.
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      // Add any external image hosts your property photos/media live on.
      // Supabase Storage is included by default since this template uses it
      // for media uploads.
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // 301s for blog posts that were rewritten at a new URL and had their old
  // post unpublished, per the client's "Positive rewrites" publishing plan -
  // keeps any existing search ranking pointed at the replacement post.
  async redirects() {
    return [
      {
        source: "/journal/is-a-murcia-golf-resort-dead-in-winter-an-honest-answer",
        destination: "/journal/winter-golf-in-murcia-october-to-may",
        permanent: true,
      },
      {
        source: "/journal/how-hot-does-murcia-get-and-does-it-flood-an-honest-2026-climate-guide",
        destination: "/journal/murcia-weather-month-by-month",
        permanent: true,
      },
      {
        source: "/journal/mar-menor-and-property-values-what-the-data-actually-shows",
        destination: "/journal/best-beaches-near-murcia-golf-resorts",
        permanent: true,
      },
      {
        source: "/journal/off-plan-bank-guarantees-in-spain-how-to-protect-your-deposit-ley-57-68",
        destination: "/journal/off-plan-bank-guarantees-in-spain-how-your-deposit-is-protected",
        permanent: true,
      },
      {
        source: "/journal/how-to-tell-whether-your-spanish-lawyer-is-actually-independent",
        destination: "/journal/how-to-choose-a-spanish-property-lawyer",
        permanent: true,
      },
      {
        source: "/journal/buying-a-resale-on-a-murcia-resort-the-debts-that-follow-the-property",
        destination: "/journal/why-buy-a-new-build-home-in-murcia",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // Silences source map upload logs during build. Upload itself only
  // happens when SENTRY_AUTH_TOKEN is set (Sentry -> Settings -> Auth
  // Tokens); without it this step is skipped harmlessly, so builds work
  // fine before that token is configured, just with minified stack traces
  // in Sentry until it is.
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
});
