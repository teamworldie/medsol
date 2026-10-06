import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Waves, Sun, Footprints, Flag } from "lucide-react";
import { getPropertiesByCommunity, COMMUNITIES } from "@/lib/properties";
import InquiryForm from "@/components/site/InquiryForm";
import Footer from "@/components/site/Footer";
import StatusBadge from "@/components/site/StatusBadge";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Serena Breeze at Serena Golf, Los Alcázares",
  description:
    "37 new 2 and 3-bedroom apartments with generous terraces on the Serena Golf course in Los Alcázares, a short walk from the town centre and the beach. From €319,000.",
  alternates: { canonical: `${SITE_URL}/serena-breeze` },
  openGraph: { url: `${SITE_URL}/serena-breeze` },
};

const A = "/assets/images/Serena-Breeze/serena-breeze-";
const G = "/assets/images/Serena-Golf/serena-golf-";

const gallery = [
  { src: `${A}rooftop-1.jpg`, alt: "Serena Breeze rooftop terrace with golf course and sea views" },
  { src: `${A}living-terrace.jpg`, alt: "Serena Breeze living room opening to the terrace" },
  { src: `${A}kitchen-1.jpg`, alt: "Serena Breeze open-plan kitchen" },
  { src: `${A}bedroom-3.jpg`, alt: "Serena Breeze bedroom with terrace access" },
  { src: `${A}golf-view-2.jpg`, alt: "View over the Serena Golf lakes towards the Mar Menor" },
  { src: `${A}balcony.jpg`, alt: "Serena Breeze terrace" },
];

export default async function SerenaBreeze() {
  const apartments = await getPropertiesByCommunity(COMMUNITIES.serena);

  return (
    <main className="bg-bg-primary overflow-x-hidden">
      {/* 1. HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={`${A}hero-aerial.jpg`}
            alt="Aerial view of Serena Breeze on the Serena Golf course in Los Alcázares"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0a0e17]/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/80 via-[#0a0e17]/30 to-[#0a0e17]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,14,23,0.65)_0%,rgba(10,14,23,0)_65%)]" />
        </div>

        <div className="relative z-10 text-center max-content">
          <div className="space-y-6">
            <span className="text-medsol-gold text-[12px] tracking-[0.5em] uppercase mb-4 block">Serena Breeze · Serena Golf</span>
            <h1 className="text-5xl md:text-8xl font-serif leading-none italic text-shadow-luxury">
              Golf, Beach <br /> <span className="not-italic text-medsol-gold-soft">&amp; Town on Foot.</span>
            </h1>
            <p className="text-[14px] tracking-[0.4em] uppercase text-text-secondary mt-8">Los Alcázares · Costa Cálida · Spain</p>
          </div>
        </div>
      </section>

      {/* 2. INTRO (LIGHT) */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text relative overflow-hidden">
        <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">The Serena Breeze Difference</span>
              <h2 className="text-6xl md:text-8xl font-serif italic leading-none">
                Walk To <br /> <span className="text-medsol-gold not-italic">The Beach.</span>
              </h2>
              <p className="text-xl leading-relaxed text-section-light-text/70 font-light max-w-lg">
                Serena Breeze sits on the Serena Golf course in Los Alcázares, a genuinely lively Mar Menor beach town. From the resort you can stroll to the town centre and the beach, with your own terrace and the fairways right outside.
              </p>
              <div className="flex gap-12 pt-8 border-t border-medsol-blue/10">
                <div className="space-y-2">
                  <span className="text-2xl font-serif text-medsol-blue">37</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold block">New Apartments</span>
                </div>
                <div className="space-y-2">
                  <span className="text-2xl font-serif text-medsol-blue">2 &amp; 3</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold block">Bedrooms · 2 Baths</span>
                </div>
                <div className="space-y-2">
                  <span className="text-2xl font-serif text-medsol-blue">€319k+</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold block">Prices From</span>
                </div>
              </div>
            </div>
            <div className="relative group overflow-hidden aspect-square">
              <Image
                src={`${A}rooftop-2.jpg`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Serena Breeze rooftop terrace overlooking the golf course"
              />
              <div className="absolute inset-0 border-[20px] border-white/20 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. APARTMENTS FOR SALE */}
      <section className="bg-bg-primary py-32 md:py-48 luxury-border border-y bg-pattern">
        <div className="max-content">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-8">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Phase 3 Apartments</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">Serena Breeze Residences</h2>
            <p className="text-text-secondary leading-loose font-light">
              Thirty-seven two and three-bedroom apartments, each with two bathrooms and really good terraces, priced from €319,000 to €459,000.
            </p>
          </div>

          {apartments.length === 0 ? (
            <p className="text-center text-text-secondary font-light">New listings for Serena Breeze are being added — get in touch for details.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 justify-center">
              {apartments.map((apt, i) => (
                <div key={apt.id} className="group cursor-pointer space-y-8 lg:col-start-2">
                  <Link href={`/property/${apt.slug}`} className="aspect-[4/5] overflow-hidden relative block">
                    <Image
                      src={apt.featuredImage ?? ""}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover grayscale transition-all duration-[1.5s] group-hover:grayscale-0 group-hover:scale-105"
                      alt={apt.title}
                    />
                    <div className="absolute inset-0 bg-medsol-blue/20 group-hover:bg-transparent transition-all" />
                    <div className="absolute top-8 left-8 text-white">
                      <span className="text-[10px] tracking-[0.3em] uppercase block font-medium">0{i + 1}</span>
                    </div>
                    <StatusBadge status={apt.status} className="absolute top-8 right-8" />
                  </Link>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-serif">{apt.title}</h3>
                    <p className="text-text-secondary text-sm font-light leading-relaxed">{apt.description}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] tracking-[0.2em] uppercase text-text-secondary pt-2">
                      <span>{apt.bedrooms} Beds</span>
                      <span>{apt.bathrooms} Baths</span>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-4">
                      {apt.price && (
                        <span className="text-lg font-serif text-white">
                          {apt.pricePrefix ?? "From"} <span className="text-medsol-gold">{apt.price}</span>
                        </span>
                      )}
                      <Link href={`/property/${apt.slug}`} className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-medsol-gold group-hover:text-white transition-colors">
                        View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. GALLERY */}
      <section className="bg-bg-primary py-32 md:py-48">
        <div className="max-content">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Inside &amp; Out</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">Life At Serena Breeze</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {gallery.map((img, i) => (
              <div key={img.src} className={`relative overflow-hidden ${i === 0 ? "col-span-2 md:col-span-2 md:row-span-2 aspect-[16/10] md:aspect-auto md:min-h-[32rem]" : "aspect-[4/3]"}`}>
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-[1.5s] hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE GOLF COURSE (LIGHT) */}
      <section className="bg-white py-32 md:py-48 text-bg-primary overflow-hidden">
        <div className="max-content">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-24 items-center">
            <div className="relative aspect-video lg:aspect-auto h-auto lg:h-[60vh] overflow-hidden w-full">
              <Image src={`${G}holes-4-6.jpg`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" alt="Serena Golf with the Mar Menor in the distance" />
            </div>
            <div className="space-y-12">
              <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">Serena Golf</span>
              <h2 className="text-6xl font-serif italic leading-none">
                Fairways <br /> <span className="text-medsol-gold not-italic">By The Sea.</span>
              </h2>
              <div className="space-y-8 text-bg-primary/70 leading-relaxed font-light text-lg">
                <p>
                  Designed by former Ryder Cup player Manuel Piñero, the course winds around the historic Torre del Rame, with lakes, palms and the Mar Menor on the horizon.
                </p>
                <ul className="space-y-4">
                  {[
                    "Designed by Ryder Cup player Manuel Piñero",
                    "Winds around the historic Torre del Rame",
                    "Lakes, palms and sea views across the course",
                    "Clubhouse restaurant and driving range",
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-16">
            {[
              { src: `${G}main.jpg`, alt: "Serena Golf aerial view" },
              { src: `${G}clubhouse.jpg`, alt: "Serena Golf clubhouse and driving range" },
              { src: `${G}hole-13.jpg`, alt: "Serena Golf hole 13" },
              { src: `${G}holes-8-9.jpg`, alt: "Serena Golf holes 8 and 9" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-[4/3] overflow-hidden">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-[1.5s] hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LOCATION & LIFESTYLE */}
      <section className="bg-bg-primary py-32 md:py-48 border-t luxury-border bg-pattern">
        <div className="max-content">
          <div className="text-center max-w-6xl mx-auto mb-24 space-y-8">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Los Alcázares</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif italic md:whitespace-nowrap">A Really Cool Beach Town</h2>
            <p className="text-text-secondary leading-loose font-light">
              Stroll from the resort to the centre of Los Alcázares and the beach, with restaurants, shops and the Mar Menor on your doorstep, and a championship-standard course outside your terrace.
            </p>
            <a href="#contact" className="inline-block mt-8 bg-medsol-gold text-bg-primary py-4 px-10 text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-white transition-colors">Inquire for Details</a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0.5 bg-white/5">
            {[
              { icon: Footprints, title: "Walk To Town", desc: "Stroll from the resort to the centre of Los Alcázares." },
              { icon: Waves, title: "Walk To The Beach", desc: "The Mar Menor beaches are within easy walking distance." },
              { icon: Flag, title: "Serena Golf", desc: "A Manuel Piñero design winding around the Torre del Rame." },
              { icon: Sun, title: "Generous Terraces", desc: "Really good outdoor space on every home to enjoy the sun." },
            ].map((item) => (
              <div key={item.title} className="bg-bg-primary p-12 space-y-6 hover:bg-[#1a2333] transition-all duration-700 group cursor-default">
                <item.icon className="w-10 h-10 text-medsol-gold group-hover:text-white stroke-[1px] transition-colors" />
                <h4 className="text-[12px] tracking-[0.3em] uppercase font-bold group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-sm text-text-secondary group-hover:text-white/80 leading-relaxed font-light transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT */}
      <section id="contact" className="bg-bg-secondary py-32 md:py-48 border-t border-white/5 relative">
        <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Next Steps</span>
            <h2 className="text-5xl md:text-8xl font-serif italic mb-8">
              Begin Your Legacy <br /> <span className="not-italic text-medsol-blue">at Serena Breeze.</span>
            </h2>
            <p className="text-text-secondary text-xl leading-relaxed font-light max-w-2xl">
              Contact our advisors for availability, pricing and private viewings at Serena Breeze.
            </p>
            <div className="w-full max-w-2xl pt-12">
              <InquiryForm variant="villa" inquiryType="Serena Breeze" />
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="MEDSOL · Serena Breeze." />
    </main>
  );
}
