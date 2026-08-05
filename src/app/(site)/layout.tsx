import type { Metadata, Viewport } from "next";
import Navbar from "@/components/site/Navbar";
import PageTransition from "@/components/site/PageTransition";
import CookieConsent from "@/components/site/CookieConsent";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Medsol Real Estate offers bespoke luxury villas and residences in Murcia, Spain, across Omala Residences, Alhama Nature and Corvera Hills.",
  image: `${SITE_URL}/assets/images/medsol-logo-light.webp`,
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Murcia, Spain",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e17",
};

export const metadata: Metadata = {
  title: {
    default: "Medsol Real Estate | Luxury Mediterranean Villas in Murcia, Spain",
    template: "%s | Medsol Real Estate",
  },
  description:
    "Medsol Real Estate offers bespoke luxury villas and residences in Murcia, Spain. Explore Omala Residences, Alhama Nature and Corvera Hills — premium Mediterranean living with world-class amenities.",
  keywords: [
    "luxury villas Murcia",
    "Mediterranean real estate",
    "Omala Residences",
    "Alhama Nature",
    "Corvera Hills",
    "luxury homes Spain",
    "resort living",
    "bespoke villas",
    "property investment Spain",
  ],
  authors: [{ name: "Medsol Real Estate" }],
  robots: "index, follow",
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      es: `${SITE_URL}/es/`,
      en: `${SITE_URL}/`,
      "x-default": `${SITE_URL}/`,
    },
  },
  openGraph: {
    type: "website",
    title: "Medsol Real Estate | Luxury Mediterranean Villas in Murcia, Spain",
    description:
      "Bespoke luxury villas and residences in Murcia, Spain. Explore Omala Residences, Alhama Nature and Corvera Hills — premium Mediterranean living.",
    url: `${SITE_URL}/`,
    siteName: "Medsol Real Estate",
    images: [`${SITE_URL}/assets/images/medsol-logo-light.webp`],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medsol Real Estate | Luxury Mediterranean Villas in Murcia, Spain",
    description: "Bespoke luxury villas and residences in Murcia, Spain. Explore Omala Residences, Alhama Nature and Corvera Hills.",
    images: [`${SITE_URL}/assets/images/medsol-logo-light.webp`],
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="medsol-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <CookieConsent />
    </div>
  );
}
