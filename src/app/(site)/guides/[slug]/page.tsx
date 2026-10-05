import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import GuideForm from "@/components/site/GuideForm";
import Footer from "@/components/site/Footer";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/siteConfig";

export function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES[slug as keyof typeof GUIDES];
  if (!guide) return {};
  return {
    title: `${guide.title} (Free PDF)`,
    description: guide.description,
    alternates: { canonical: `${SITE_URL}/guides/${guide.slug}` },
    openGraph: { url: `${SITE_URL}/guides/${guide.slug}`, images: [`${SITE_URL}${guide.cover}`] },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDES[slug as keyof typeof GUIDES];
  if (!guide) notFound();

  return (
    <main className="bg-bg-primary pt-32 relative overflow-x-hidden">
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />
      <section className="py-24 relative z-10">
        <div className="max-content">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-6xl mx-auto">
            <div className="space-y-10">
              <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase block">Free guide · {guide.pages} pages</span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight italic text-white">{guide.title}</h1>
              <p className="text-text-secondary leading-loose font-light text-lg">{guide.description}</p>
              <ul className="space-y-4">
                {guide.bullets.map((b) => (
                  <li key={b} className="flex gap-4 text-white/90 font-light">
                    <Check className="w-5 h-5 text-medsol-gold shrink-0 mt-1" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="relative aspect-video w-full max-w-md border border-white/10 shadow-2xl">
                <Image src={guide.cover} alt={guide.title} fill sizes="(min-width: 1024px) 448px, 100vw" className="object-cover" />
              </div>
              <p className="text-text-secondary text-sm font-light">Written by Lee Doherty, founder of MedSol Real Estate.</p>
            </div>

            <div className="bg-bg-secondary/80 backdrop-blur-sm p-10 lg:p-12 border border-white/10 w-full">
              <h2 className="text-2xl font-serif mb-2 text-white">Get your free copy</h2>
              <p className="text-text-secondary font-light text-sm mb-10">Fill in your details and the PDF downloads instantly.</p>
              <GuideForm guide={guide} />
            </div>
          </div>
        </div>
      </section>
      <Footer tagline="MEDSOL · Guides." />
    </main>
  );
}
