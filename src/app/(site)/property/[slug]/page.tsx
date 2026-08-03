import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyBySlug, getGallery, getAreaData } from "@/lib/properties";
import Footer from "@/components/site/Footer";
import VillaDetailView from "./VillaDetailView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  return {
    title: property.seoTitle || property.title,
    description: property.seoDescription || property.description || undefined,
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
