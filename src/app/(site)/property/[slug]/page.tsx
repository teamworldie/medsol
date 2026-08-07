import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyBySlug, getGallery, getAreaData } from "@/lib/properties";
import Footer from "@/components/site/Footer";
import VillaDetailView from "./VillaDetailView";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  const propertyUrl = `${SITE_URL}/property/${property.slug}`;
  return {
    title: property.seoTitle || property.title,
    description: property.seoDescription || property.description || undefined,
    alternates: { canonical: propertyUrl },
    openGraph: {
      title: property.seoTitle || property.title,
      description: property.seoDescription || property.description || undefined,
      url: propertyUrl,
      images: property.featuredImage ? [property.featuredImage] : undefined,
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const gallery = getGallery(property);
  const areaData = getAreaData(property);

  return (
    <main className="bg-bg-primary overflow-x-hidden">
      <VillaDetailView property={property} gallery={gallery} areaData={areaData} />
      <Footer tagline="MEDSOL · Luxury Real Estate." />
    </main>
  );
}
