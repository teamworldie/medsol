import type { Metadata, Viewport } from "next";
import Navbar from "@/components/site/Navbar";
import PageTransition from "@/components/site/PageTransition";

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
    canonical: "https://www.medsol.es/",
    languages: {
      es: "https://www.medsol.es/es/",
      en: "https://www.medsol.es/",
      "x-default": "https://www.medsol.es/",
    },
  },
  openGraph: {
    type: "website",
    title: "Medsol Real Estate | Luxury Mediterranean Villas in Murcia, Spain",
    description:
      "Bespoke luxury villas and residences in Murcia, Spain. Explore Omala Residences, Alhama Nature and Corvera Hills — premium Mediterranean living.",
    url: "https://www.medsol.es/",
    siteName: "Medsol Real Estate",
    images: ["https://www.medsol.es/assets/images/medsol-logo-light.webp"],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medsol Real Estate | Luxury Mediterranean Villas in Murcia, Spain",
    description: "Bespoke luxury villas and residences in Murcia, Spain. Explore Omala Residences, Alhama Nature and Corvera Hills.",
    images: ["https://www.medsol.es/assets/images/medsol-logo-light.webp"],
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="medsol-site">
      <Navbar />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
