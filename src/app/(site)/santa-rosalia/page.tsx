import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Waves, Shield, Sun, Trees } from "lucide-react";
import { getPropertiesByCommunity, COMMUNITIES } from "@/lib/properties";
import InquiryForm from "@/components/site/InquiryForm";
import Footer from "@/components/site/Footer";
import StatusBadge from "@/components/site/StatusBadge";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Santa Rosalia Lake & Life Resort",
  description:
    "Santa Rosalia Lake & Life Resort — a family-focused gated community in Murcia built around Europe's largest Crystal Lagoon, 15 minutes from the airport.",
  alternates: { canonical: `${SITE_URL}/santa-rosalia` },
  openGraph: { url: `${SITE_URL}/santa-rosalia` },
};

export default async function SantaRosalia() {
  const villas = await getPropertiesByCommunity(COMMUNITIES.santaRosalia);

  return (
    <main className="bg-bg-primary overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
            <source src="/assets/videos/santa-rosalia-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0a0e17]/60" />
        </div>

        <div className="relative z-10 text-center max-content">
          <div className="space-y-6">
            <span className="text-medsol-gold text-[12px] tracking-[0.5em] uppercase mb-4 block">Santa Rosalia Lake &amp; Life Resort</span>
            <h1 className="text-5xl md:text-8xl font-serif leading-none italic text-shadow-luxury">
              Europe&apos;s Largest <br /> <span className="not-italic text-medsol-gold-soft">Crystal Lagoon.</span>
            </h1>
            <p className="text-[14px] tracking-[0.4em] uppercase text-text-secondary mt-8">Family Resort Living · Murcia · Spain</p>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY (LIGHT SECTION) */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text relative overflow-hidden">
        <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">The Santa Rosalia Difference</span>
              <h2 className="text-6xl md:text-8xl font-serif italic leading-none">
                A Caribbean <br /> <span className="text-medsol-gold not-italic">In Spain.</span>
              </h2>
              <p className="text-xl leading-relaxed text-section-light-text/70 font-light max-w-lg">
                Spanning over 700,000m² on the Costa Cálida, Santa Rosalía is home to a 16,000m² Crystal Lagoon — the largest man-made lake in Europe — with turquoise waters, white sandy beaches and designated areas for swimming and non-motorised watersports. At its heart, La Reserva, a 124,000m² green oasis of some 4,000 native trees and plants, keeps the resort cool and sustainable year-round.
              </p>
              <div className="flex gap-12 pt-8 border-t border-medsol-blue/10">
                <div className="space-y-2">
                  <span className="text-2xl font-serif text-medsol-blue">700,000m²</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold block">Master Plan</span>
                </div>
                <div className="space-y-2">
                  <span className="text-2xl font-serif text-medsol-blue">1,200+</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold block">Residences</span>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden aspect-square">
              <Image
                src="/assets/images/Santa-Rosalia/santa-rosalia-chiringuito.jpeg"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Santa Rosalia Chiringuito"
              />
              <div className="absolute inset-0 border-[20px] border-white/20 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. VILLAS & APARTMENTS */}
      <section className="bg-bg-primary py-32 md:py-48 luxury-border border-y bg-pattern">
        <div className="max-content">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-8">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Villas &amp; Apartments For Sale</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">Santa Rosalia Residences</h2>
            <p className="text-text-secondary leading-loose font-light">
              Developed in collaboration with Crystal Lagoons by a developer with over 60 years in the industry, Santa Rosalia offers modern low-rise apartments — including penthouses with private rooftop solariums — and contemporary freestanding villas with private pools.
            </p>
          </div>

          {villas.length === 0 ? (
            <p className="text-center text-text-secondary font-light">New listings for Santa Rosalia are being added — check back soon, or get in touch for early access.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {villas.map((villa, i) => (
                <div key={villa.id} className="group cursor-pointer space-y-8">
                  <Link href={`/property/${villa.slug}`} className="aspect-[4/5] overflow-hidden relative block">
                    <Image
                      src={villa.featuredImage ?? ""}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover grayscale transition-all duration-[1.5s] group-hover:grayscale-0 group-hover:scale-105"
                      alt={villa.title}
                    />
                    <div className="absolute inset-0 bg-medsol-blue/20 group-hover:bg-transparent transition-all" />
                    <div className="absolute top-8 left-8 text-white">
                      <span className="text-[10px] tracking-[0.3em] uppercase block font-medium">0{i + 1}</span>
                    </div>
                    <StatusBadge status={villa.status} className="absolute top-8 right-8" />
                  </Link>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-serif">{villa.title}</h3>
                    <p className="text-text-secondary text-sm font-light leading-relaxed min-h-[4.5rem]">{villa.description}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] tracking-[0.2em] uppercase text-text-secondary pt-2">
                      <span>{villa.bedrooms} Beds</span>
                      <span>{villa.bathrooms} Baths</span>
                      <span>{villa.area} Build</span>
                      {villa.landArea && <span>Plot: {villa.landArea}</span>}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-4">
                      {villa.price && <span className="text-lg font-serif text-white">{villa.pricePrefix ?? "From"} <span className="text-medsol-gold">{villa.price}</span></span>}
                      <Link href={`/property/${villa.slug}`} className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-medsol-gold group-hover:text-white transition-colors">
                        View Specifications <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. THE CRYSTAL LAGOON (LIGHT SECTION) */}
      <section className="bg-white py-32 md:py-48 text-bg-primary overflow-hidden">
        <div className="max-content">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-24 items-center">
            <div className="relative aspect-video lg:aspect-auto h-auto lg:h-[60vh] overflow-hidden w-full">
              <Image
                src="/assets/images/Santa-Rosalia/santa-rosalia-lagoon-view.jpg"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                alt="Santa Rosalia Crystal Lagoon"
              />
            </div>
            <div className="space-y-12">
              <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">The Crystal Lagoon</span>
              <h2 className="text-6xl font-serif italic leading-none">
                Beaches, <br /> <span className="text-medsol-gold not-italic">Reimagined.</span>
              </h2>
              <div className="space-y-8 text-bg-primary/70 leading-relaxed font-light text-lg">
                <p>A Caribbean-style atmosphere in southern Spain: white sandy beaches, islands and turquoise water, with designated areas for swimming and non-motorised watersports.</p>
                <ul className="space-y-4">
                  {[
                    "16,000m² man-made Crystal Lagoon",
                    "White sand beaches and swimming areas",
                    "La Reserva: 124,000m² green oasis, ~4,000 native trees",
                    "Beachfront clubhouse, restaurants and adventure golf",
                    "Beach volleyball, multi-sport zones and running tracks",
                  ].map((item) => (
                    <li key={item} className="flex gap-4 items-center border-b border-medsol-blue/10 pb-4">
                      <div className="w-1.5 h-1.5 bg-medsol-gold rounded-full" />
                      <span className="text-sm tracking-wide">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LOCATION & LIFESTYLE */}
      <section className="bg-bg-primary py-32 md:py-48">
        <div className="max-content">
          <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
            <div className="space-y-12">
              <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">The Neighborhood</span>
              <h2 className="text-6xl md:text-8xl font-serif italic leading-none">
                Family Living, <br /> <span className="text-white not-italic">Fully Secured.</span>
              </h2>
              <p className="text-text-secondary leading-loose text-lg font-light">
                Located near Torre-Pacheco and Los Alcázares, Santa Rosalia operates as a fully gated resort with 24-hour physical security, a 5–10 minute drive from the golden beaches of the Mar Menor and surrounded by several of the region&apos;s top golf courses.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="space-y-4">
                  <Shield className="w-8 h-8 text-medsol-gold stroke-[1px]" />
                  <h4 className="text-[12px] tracking-[0.2em] uppercase font-bold">24hr Security</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-light">Gated access and physical security control across the resort.</p>
                </div>
                <div className="space-y-4">
                  <Trees className="w-8 h-8 text-medsol-gold stroke-[1px]" />
                  <h4 className="text-[12px] tracking-[0.2em] uppercase font-bold">La Reserva</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-light">A sustainable Mediterranean microclimate at the resort&apos;s core.</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden">
              <Image src="/assets/images/Santa-Rosalia/romero-17-solarium.jpg" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" alt="Romero 17 solarium" />
            </div>
          </div>
        </div>
      </section>

      {/* 5.1 RESORT AMENITIES */}
      <section className="bg-bg-primary py-32 md:py-48 border-t luxury-border bg-pattern">
        <div className="max-content">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-8">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Near Torre-Pacheco &amp; Los Alcázares</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">A Complete Resort</h2>
            <p className="text-text-secondary leading-loose font-light">
              Santa Rosalia sits roughly 15–30 minutes from Murcia International Airport (Corvera) and about an hour from Alicante Airport, 5–10 minutes from the Mar Menor, with modern apartments, penthouses and villas from a developer with over 60 years in the industry.
            </p>
            <a href="#contact" className="inline-block mt-8 bg-medsol-gold text-bg-primary py-4 px-10 text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-white transition-colors">Inquire for Details</a>
          </div>

          <div className="grid md:grid-cols-3 gap-0.5 bg-white/5">
            {[
              { icon: Waves, title: "Crystal Lagoon", desc: "16,000m² of turquoise water, beaches and watersports." },
              { icon: Sun, title: "Adventure Golf", desc: "Family-friendly adventure golf on site." },
              { icon: Trees, title: "La Reserva", desc: "124,000m² green oasis of native Mediterranean planting." },
              { icon: Shield, title: "24/7 Security", desc: "Fully gated resort with physical security control." },
              { icon: Sun, title: "Beachfront Clubhouse", desc: "Restaurants and social spaces on the lagoon." },
              { icon: ArrowRight, title: "Investment Ready", desc: "Managed holiday-letting structures on select properties." },
            ].map((item, i) => (
              <div key={i} className="bg-bg-primary p-16 space-y-6 hover:bg-[#1a2333] transition-all duration-700 group cursor-default">
                <item.icon className="w-12 h-12 text-medsol-gold group-hover:text-white stroke-[1px] transition-colors" />
                <h4 className="text-[12px] tracking-[0.3em] uppercase font-bold group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-sm text-text-secondary group-hover:text-white/80 leading-relaxed font-light transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CONTACT */}
      <section id="contact" className="bg-bg-secondary py-32 md:py-48 border-t border-white/5 relative">
        <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Next Steps</span>
            <h2 className="text-5xl md:text-8xl font-serif italic mb-8">
              Begin Your Legacy <br /> <span className="not-italic text-medsol-blue">at Santa Rosalia.</span>
            </h2>
            <p className="text-text-secondary text-xl leading-relaxed font-light max-w-2xl">
              Contact our Santa Rosalia specialist advisors for private viewings and early-access pricing information.
            </p>

            <div className="w-full max-w-2xl pt-12">
              <InquiryForm variant="villa" inquiryType="Santa Rosalia" />
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="MEDSOL · Santa Rosalia Lake & Life Resort." />
    </main>
  );
}
