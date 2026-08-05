import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Waves, Shield, Sun, Wind } from "lucide-react";
import { getPropertiesByCommunity, COMMUNITIES } from "@/lib/properties";
import InquiryForm from "@/components/site/InquiryForm";
import Footer from "@/components/site/Footer";
import StatusBadge from "@/components/site/StatusBadge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Omala Residences",
  description: "Omala Residences — space as a privilege, amplitude as a hallmark. Redefining luxury living in Murcia.",
};

export default async function OmalaResidences() {
  const villas = await getPropertiesByCommunity(COMMUNITIES.omala);

  return (
    <main className="bg-bg-primary overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img src="/assets/images/Omala-Residences-Entorno.webp" alt="Omala Residences Entorno" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/80 via-[#0a0e17]/40 to-bg-primary" />
        </div>

        <div className="relative z-10 text-center max-content">
          <div className="space-y-6">
            <span className="text-medsol-gold text-[12px] tracking-[0.5em] uppercase mb-4 block">Omala Residences</span>
            <h1 className="text-5xl md:text-8xl font-serif leading-none italic text-shadow-luxury">
              Redefining <br /> <span className="not-italic text-medsol-gold-soft">Amplitude.</span>
            </h1>
            <p className="text-[14px] tracking-[0.4em] uppercase text-text-secondary mt-8">Bespoke Luxury · Murcia · Spain</p>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY (LIGHT SECTION) */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text relative overflow-hidden">
        <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">The Omala Spirit</span>
              <h2 className="text-6xl md:text-8xl font-serif italic leading-none">
                Space as <br /> <span className="text-medsol-gold not-italic">A Privilege.</span>
              </h2>
              <p className="text-xl leading-relaxed text-section-light-text/70 font-light max-w-lg">
                At Omala, the developer&apos;s architectural brief was simple: create the most expansive living plots in the Mediterranean. We believe that space is the ultimate luxury, providing a canvas for privacy, serenity, and panoramic connection to the landscape.
              </p>
              <div className="flex gap-12 pt-8 border-t border-medsol-blue/10">
                <div className="space-y-2">
                  <span className="text-2xl font-serif text-medsol-blue">410 - 920 m²</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold block">Plot Sizes</span>
                </div>
                <div className="space-y-2">
                  <span className="text-2xl font-serif text-medsol-blue">3-5</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold block">Bedrooms</span>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden">
              <img src="/assets/images/lwoXkcnM.webp" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Omala Lifestyle" />
              <div className="absolute inset-0 border-[20px] border-white/20 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. ARCHITECTURAL SHOWCASE */}
      <section className="bg-bg-primary py-32 md:py-48 luxury-border border-y bg-pattern">
        <div className="max-content">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-8">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Architectural Excellence</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">Omala Residences Villas</h2>
            <p className="text-text-secondary leading-loose font-light">At Omala Residences, space is not only lived in — it is breathed.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {villas.map((villa, i) => (
              <div key={villa.id} className="group cursor-pointer space-y-8">
                <Link href={`/property/${villa.slug}`} className="aspect-[4/5] overflow-hidden relative block">
                  <img src={villa.featuredImage ?? ""} className="w-full h-full object-cover grayscale transition-all duration-[1.5s] group-hover:grayscale-0 group-hover:scale-105" alt={villa.title} />
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
                    <span>Plot: {villa.landArea}</span>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-4">
                    {villa.price && <span className="text-lg font-serif text-white">From <span className="text-medsol-gold">{villa.price}</span></span>}
                    <Link href={`/property/${villa.slug}`} className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-medsol-gold group-hover:text-white transition-colors">
                      View Specifications <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE INTERIOR EXPERIENCE (LIGHT SECTION) */}
      <section className="bg-white py-32 md:py-48 text-bg-primary overflow-hidden">
        <div className="max-content">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-24 items-center">
            <div className="relative aspect-video lg:aspect-auto h-auto lg:h-[60vh] overflow-hidden w-full">
              <img src="/assets/images/Cocina.webp" className="w-full h-full object-cover" alt="Interior Design" />
            </div>
            <div className="space-y-12">
              <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">Interior Curation</span>
              <h2 className="text-6xl font-serif italic leading-none">
                Noble <br /> <span className="text-medsol-gold not-italic">Texture.</span>
              </h2>
              <div className="space-y-8 text-bg-primary/70 leading-relaxed font-light text-lg">
                <p>Every surface at Omala has been chosen for its tactile quality and historical resonance. Italian travertine, sustainable oak, and brushed bronze create a composition of quiet luxury.</p>
                <ul className="space-y-4">
                  {[
                    "Full-height minimal window systems",
                    "Custom Italian kitchen cabinetry",
                    "Smart home climate and lighting control",
                    "Aerothermal highly-efficient energy systems",
                    "Natural stone floors throughout",
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
                Quietude <br /> <span className="text-white not-italic">Secured.</span>
              </h2>
              <p className="text-text-secondary leading-loose text-lg font-light">
                Omala Residences sits within a gated sanctuary, offering 24/7 security and a private concierge service designed to anticipated your needs before you do.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="space-y-4">
                  <Shield className="w-8 h-8 text-medsol-gold stroke-[1px]" />
                  <h4 className="text-[12px] tracking-[0.2em] uppercase font-bold">24hr Security</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-light">Perimeter surveillance and gated access for total peace of mind.</p>
                </div>
                <div className="space-y-4">
                  <Wind className="w-8 h-8 text-medsol-gold stroke-[1px]" />
                  <h4 className="text-[12px] tracking-[0.2em] uppercase font-bold">Concierge</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-light">Bespoke management services for your home and lifestyle.</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square grid grid-cols-2 grid-rows-2 gap-4">
              <div className="col-span-2 overflow-hidden"><img src="/assets/images/Comedor-cocina.webp" className="w-full h-full object-cover" alt="Comedor cocina" /></div>
              <div className="overflow-hidden"><img src="/assets/images/Ac0Q8PEQ.webp" className="w-full h-full object-cover" alt="Salón cocina" /></div>
              <div className="overflow-hidden"><img src="/assets/images/Piscina comunitaria.webp" className="w-full h-full object-cover" alt="Piscina comunitaria" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.1 RESORT AMENITIES */}
      <section className="bg-bg-primary py-32 md:py-48 border-t luxury-border bg-pattern">
        <div className="max-content">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-8">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Hacienda del Alamo</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">World-Class Resort</h2>
            <p className="text-text-secondary leading-loose font-light">
              Omala Residences is situated within Hacienda del Alamo, just 15 minutes from Murcia Airport. Enjoy 410m²-920m² plots with 3-5 bedroom homes, private pools, and pricing from €300k - €800k.
            </p>
            <a href="#contact" className="inline-block mt-8 bg-medsol-gold text-bg-primary py-4 px-10 text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-white transition-colors">Inquire for Details</a>
          </div>

          <div className="grid md:grid-cols-3 gap-0.5 bg-white/5">
            {[
              { icon: Sun, title: "Championship Golf", desc: "18 holes plus a separate academy course and driving range." },
              { icon: Wind, title: "Clubhouse", desc: "Featuring a Terrace Bar & Restaurant for socializing." },
              { icon: Waves, title: "Spa & Wellness", desc: "Onsite spa facilities and comprehensive wellness treatments." },
              { icon: Shield, title: "Active Lifestyle", desc: "Professional paddle and tennis courts." },
              { icon: Sun, title: "Gastronomy", desc: "7 distinct restaurants and bars within the resort." },
              { icon: ArrowRight, title: "4* Hotel", desc: "Luxury onsite accommodation for your guests." },
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
              Begin Your Legacy <br /> <span className="not-italic text-medsol-blue">at Omala.</span>
            </h2>
            <p className="text-text-secondary text-xl leading-relaxed font-light max-w-2xl">
              Contact our Omala specialist advisors for private viewings and early-access pricing information.
            </p>

            <div className="w-full max-w-2xl pt-12">
              <InquiryForm variant="villa" inquiryType="Omala" />
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="MEDSOL · Omala Residences." />
    </main>
  );
}
