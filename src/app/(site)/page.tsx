"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Wind, Sun, Shield, Settings, Heart, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import InquiryForm from "@/components/site/InquiryForm";
import Footer from "@/components/site/Footer";

const MotionImage = motion.create(Image);

const collections = {
  omala: {
    heading: (
      <>
        A Legacy <br /> in <span className="text-medsol-gold-soft">Every Detail.</span>
      </>
    ),
    description:
      "Our featured residences at Omala define the peak of European resort living. Just 15 minutes from Murcia Airport, this private resort offers 24/7 gated security, a championship golf course with an academy and driving range, paddle and tennis courts, 7 restaurants and bars, a 4* hotel and an onsite spa.",
    stats: [
      { label: "Pricing", value: "335.300€ - 558.000€" },
      { label: "Plot Sizes", value: "410m² - 1,040m²" },
      { label: "Residences", value: "3-4 Bed + Private Pool" },
      { label: "Security", value: "24/7 Gated" },
    ],
    image: "/assets/images/Fachada piscina diurna.webp",
    featured: "Villa Colia",
  },
  alhama: {
    heading: (
      <>
        <span>Embrace Nature</span> <br /> <span className="text-medsol-gold-soft">& Golf.</span>
      </>
    ),
    description:
      "Alhama Nature offers an idyllic setting just 20 minutes from Murcia Airport. It features an 18-hole Golf Course designed by Jack Nicklaus, a sports centre, clubhouse, and 10 bars & restaurants.",
    stats: [
      { label: "Pricing", value: "208.425€ - 369.900€" },
      { label: "Apartments", value: "Large 2 & 3 Bed" },
      { label: "Villas", value: "2-4 Bed" },
      { label: "Golf Course", value: "18-hole Jack Nicklaus" },
    ],
    image: "/assets/images/Alhama-sunrise-52-scaled.webp",
    featured: "18-hole Golf Course",
  },
  corvera: {
    heading: (
      <>
        <span>Build the life</span> <br /> <span className="text-medsol-gold-soft">you choose.</span>
      </>
    ),
    description:
      "Corvera Hills Residences invite you to live the life you have always dreamed of: with greater freedom, more comfort, and a deeper connection to the surroundings.",
    stats: [
      { label: "Location", value: "Murcia" },
      { label: "Apartments", value: "2 & 3 Bed" },
      { label: "Villas", value: "3 Bed" },
      { label: "Environment", value: "Nature & Serenity" },
    ],
    image: "/assets/images/Corvera - Aneas Apartments/ANEAS APARTMENTS_terraza atico.webp",
    featured: "Aneas Apartments",
  },
};

export default function Home() {
  const [activeCollection, setActiveCollection] = useState<"omala" | "alhama" | "corvera">("omala");
  const collection = collections[activeCollection];

  return (
    <main className="bg-bg-primary overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video autoPlay loop muted playsInline className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover scale-105 opacity-60">
            <source src="/assets/videos/medsol-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/90 via-[#0a0e17]/40 to-bg-primary" />
        </div>

        <div className="relative z-10 text-center max-w-5xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}>
            <span className="text-medsol-gold text-[12px] tracking-[0.5em] uppercase mb-6 block">The Pinnacle of Living</span>
            <h1 className="text-5xl md:text-8xl font-serif leading-none mb-8 text-shadow-luxury">
              Mediterranean <br /> <span className="italic">Elevated.</span>
            </h1>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center mt-12">
              <Link href="/omala-residences" className="group flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase bg-medsol-blue px-10 py-5 hover:bg-medsol-blue-light transition-all duration-500">
                Omala Residences <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/alhama-nature" className="group flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase bg-medsol-blue px-10 py-5 hover:bg-medsol-blue-light transition-all duration-500">
                Alhama Nature <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/corvera" className="group flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase bg-medsol-blue px-10 py-5 hover:bg-medsol-blue-light transition-all duration-500">
                Corvera Hills <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. INTRODUCTION SECTION (LIGHT) */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text relative overflow-hidden">
        <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-24 items-start">
            <div className="space-y-8">
              <span className="text-medsol-blue text-[12px] tracking-[0.5em] uppercase font-medium">Medsol Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-serif leading-[1.1]">
                Crafting Legacies <br /> <span className="italic">in the Sun.</span>
              </h2>
            </div>
            <div className="space-y-12">
              <p className="text-xl md:text-2xl font-light leading-relaxed text-section-light-text/80 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left">
                Our Vision is to unite the most prestigious resort destinations in Murcia under one extraordinary brand identity. We help buyers discover premium resort properties, curating an architectural experience that honors the light, space, and spirit of the Mediterranean.
              </p>

              <div className="grid md:grid-cols-3 gap-12 pt-12 border-t border-medsol-blue/10">
                {[
                  { icon: Waves, title: "Prime Locations", desc: "Hand-picked sites between sea and sanctuary." },
                  { icon: Settings, title: "Architectural Prowess", desc: "Design-forward villas that master light and shadow." },
                  { icon: Sun, title: "Resort Lifestyle", desc: "A curated existence involving golf, wellness, and serenity." },
                ].map((pill) => (
                  <div key={pill.title} className="space-y-4">
                    <pill.icon className="w-8 h-8 text-medsol-blue stroke-[1px]" />
                    <h4 className="text-[12px] tracking-[0.2em] uppercase font-bold">{pill.title}</h4>
                    <p className="text-sm text-section-light-text/60 leading-relaxed">{pill.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESORT GALLERY GRID (MASONRY) */}
      <section className="bg-bg-primary py-32 bg-pattern overflow-hidden">
        <div className="max-content">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-7xl font-serif italic">Architectural Mastery</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[350px]">
            <motion.div whileHover={{ scale: 0.98 }} className="col-span-2 row-span-2 overflow-hidden group relative">
              <Image src="/assets/images/Fachada diurna.webp" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-all duration-1000" alt="Fachada diurna" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="overflow-hidden group relative">
              <Image src="/assets/images/Piscina en alta sin logo.webp" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-all duration-1000" alt="Piscina en alta sin logo" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="overflow-hidden group relative">
              <Image src="/assets/images/Comedor-cocina.webp" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-all duration-1000" alt="Comedor cocina" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="overflow-hidden group relative">
              <Image src="/assets/images/Puerta principal.webp" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-all duration-1000" alt="Puerta principal" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="overflow-hidden group relative">
              <Image src="/assets/images/HOTEL-5-PISCINA-1-1024x512.webp" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-all duration-1000" alt="Hotel Piscina" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED RESIDENCES SECTION */}
      <section className="bg-bg-secondary py-32 md:py-48 luxury-border border-y">
        <div className="max-content">
          <div className="hidden md:grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12 min-w-0">
              <div className="space-y-4">
                <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase pb-6 block">Exquisite Living Spaces</span>
                <div className="flex gap-6 md:gap-8 border-b border-white/5 overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  <button onClick={() => setActiveCollection("omala")} className={cn("text-[10px] tracking-[0.3em] uppercase font-bold pb-4 transition-colors whitespace-nowrap", activeCollection === "omala" ? "text-medsol-gold" : "text-text-secondary hover:text-medsol-gold")}>Omala</button>
                  <button onClick={() => setActiveCollection("alhama")} className={cn("text-[10px] tracking-[0.3em] uppercase font-bold pb-4 transition-colors whitespace-nowrap", activeCollection === "alhama" ? "text-medsol-gold" : "text-text-secondary hover:text-medsol-gold")}>Alhama</button>
                  <button onClick={() => setActiveCollection("corvera")} className={cn("text-[10px] tracking-[0.3em] uppercase font-bold pb-4 transition-colors whitespace-nowrap", activeCollection === "corvera" ? "text-medsol-gold" : "text-text-secondary hover:text-medsol-gold")}>Corvera</button>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">{collection.heading}</h2>
              </div>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light">{collection.description}</p>

              <div className="grid grid-cols-2 gap-6 md:gap-8 py-8 border-y border-white/5">
                {collection.stats.map((stat) => (
                  <div key={stat.label}>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-text-secondary block mb-1">{stat.label}</span>
                    <span className="text-xl font-serif text-medsol-gold">{stat.value}</span>
                  </div>
                ))}
              </div>

              <Link href={activeCollection === "omala" ? "/omala-residences" : activeCollection === "alhama" ? "/alhama-nature" : "/corvera"} className="flex items-center gap-6 group">
                <span className="text-[12px] tracking-[0.3em] uppercase">
                  Explore {activeCollection === "omala" ? "Omala" : activeCollection === "alhama" ? "Alhama" : "Corvera"}
                </span>
                <div className="w-16 h-16 rounded-full border border-medsol-gold flex items-center justify-center group-hover:bg-medsol-gold transition-all duration-500">
                  <ArrowRight className="w-6 h-6 text-medsol-gold group-hover:text-bg-primary transition-colors" />
                </div>
              </Link>
            </div>

            <div className="relative aspect-[4/5] md:aspect-square group overflow-hidden">
              <MotionImage
                key={activeCollection}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                src={collection.image}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                alt="Main Residence"
              />
              <div className="absolute bottom-8 right-8 bg-medsol-gold p-8 text-bg-primary">
                <span className="text-[10px] tracking-[0.3em] uppercase block mb-2">Featured</span>
                <span className="text-3xl font-serif italic">{collection.featured}</span>
              </div>
            </div>
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden flex flex-col gap-32">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase pb-6 block border-b border-white/5">Exquisite Living Spaces</span>

            {(Object.entries(collections) as [keyof typeof collections, (typeof collections)["omala"]][]).map(([key, coll]) => (
              <div key={key} className="space-y-12">
                <div className="space-y-4">
                  <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-medsol-gold">{key}</h3>
                  <h2 className="text-4xl font-serif leading-tight">{coll.heading}</h2>
                </div>

                <div className="relative aspect-[4/5] group overflow-hidden">
                  <Image src={coll.image} fill sizes="100vw" className="object-cover" alt={`${key} Residence`} />
                  <div className="absolute bottom-4 right-4 bg-medsol-gold p-6 text-bg-primary">
                    <span className="text-[10px] tracking-[0.3em] uppercase block mb-1">Featured</span>
                    <span className="text-2xl font-serif italic">{coll.featured}</span>
                  </div>
                </div>

                <p className="text-text-secondary text-base leading-relaxed font-light">{coll.description}</p>

                <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/5">
                  {coll.stats.map((stat) => (
                    <div key={stat.label}>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-text-secondary block mb-1">{stat.label}</span>
                      <span className="text-xl font-serif text-medsol-gold">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <Link href={key === "omala" ? "/omala-residences" : key === "alhama" ? "/alhama-nature" : "/corvera"} className="flex items-center gap-6 group">
                  <span className="text-[12px] tracking-[0.3em] uppercase">Explore {key}</span>
                  <div className="w-16 h-16 rounded-full border border-medsol-gold flex items-center justify-center group-hover:bg-medsol-gold transition-all duration-500">
                    <ArrowRight className="w-6 h-6 text-medsol-gold group-hover:text-bg-primary transition-colors" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OMALA FEATURE SECTION */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <Image src="/assets/images/Omala-Residences-Slider-Home-001.webp" fill sizes="100vw" className="object-cover" alt="Omala" />
          <div className="absolute inset-0 bg-medsol-blue/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/40 to-transparent" />
        </div>
        <div className="max-content relative z-10">
          <div className="max-w-4xl space-y-10">
            <span className="text-medsol-gold text-[12px] tracking-[0.5em] uppercase">Omala Residences</span>
            <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif italic leading-none">
              The Luxury <br /> Of Space.
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed font-light">
              Amplitude redefined. Omala Residences offer the largest architectural plots in the region,<br />designed for those who value privacy and expansive views above all else.
            </p>
            <Link href="/omala-residences" className="inline-flex py-4 px-12 bg-white text-medsol-blue text-[11px] tracking-[0.3em] uppercase hover:bg-medsol-gold hover:text-white transition-all font-bold">
              Explore Omala
            </Link>
          </div>
        </div>
      </section>

      {/* 6. ALHAMA FEATURE SECTION */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <Image src="/assets/images/2_PS.webp" fill sizes="100vw" className="object-cover" alt="Alhama" />
          <div className="absolute inset-0 bg-[#387262]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-l from-bg-primary via-bg-primary/40 to-transparent" />
        </div>
        <div className="max-content relative z-10 text-right">
          <div className="max-w-4xl ml-auto space-y-10 md:pr-8">
            <span className="text-medsol-gold text-[12px] tracking-[0.5em] uppercase">Alhama Nature</span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif italic leading-none">
              <span className="whitespace-nowrap">Embrace Nature</span> <br /> <span className="whitespace-nowrap">& Golf.</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed font-light">
              An idyllic setting nestled around a Jack Nicklaus signature golf course. Experience large, beautifully appointed apartments and villas designed for seamless indoor-outdoor living.
            </p>
            <Link href="/alhama-nature" className="inline-flex py-4 px-12 bg-[#D6B06A] text-bg-primary text-[11px] tracking-[0.3em] uppercase hover:bg-white transition-all font-bold">
              Explore Alhama
            </Link>
          </div>
        </div>
      </section>

      {/* 6.5 CORVERA FEATURE SECTION */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <Image src="/assets/images/Corvera - Aneas Villas/Aneas_aerea.webp" fill sizes="100vw" className="object-cover" alt="Corvera" />
          <div className="absolute inset-0 bg-medsol-blue/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/40 to-transparent" />
        </div>
        <div className="max-content relative z-10">
          <div className="max-w-4xl space-y-10">
            <span className="text-medsol-gold text-[12px] tracking-[0.5em] uppercase">Corvera Hills Golf</span>
            <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif italic leading-none">
              A Mediterranean <br /> Lifestyle.
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed font-light">
              In the Region of Murcia, enveloped by nature, local gastronomic delights and a welcoming international community.
            </p>
            <Link href="/corvera" className="inline-flex py-4 px-12 bg-white text-medsol-blue text-[11px] tracking-[0.3em] uppercase hover:bg-medsol-gold hover:text-white transition-all font-bold">
              Explore Corvera
            </Link>
          </div>
        </div>
      </section>

      {/* 7. LOCATION SECTION + MAP */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text">
        <div className="max-content">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">Strategic Location</span>
                <h2 className="text-6xl md:text-8xl font-serif leading-none italic">
                  Murcia, Spain. <br /> <span className="text-4xl md:text-6xl text-medsol-gold not-italic mt-4 inline-block">The Gilded Hub.</span>
                </h2>
              </div>
              <p className="text-section-light-text/70 leading-loose text-lg font-light">
                Nestled between the cultural depth of Murcia City and the pristine waters of the Mar Menor, Medsol destinations offer the perfect balance of seclusion and connectivity.
              </p>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { time: "15 MIN", place: "Airport" },
                  { time: "25 MIN", place: "Murcia & Cartagena City" },
                  { time: "25 MIN", place: "Beach" },
                  { time: "ONSITE", place: "Golf" },
                ].map((loc) => (
                  <div key={loc.place} className="flex flex-col gap-2 border-l border-medsol-gold pl-6">
                    <span className="text-medsol-blue font-serif text-2xl">{loc.time}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold">{loc.place}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square md:aspect-video grayscale contrast-125 overflow-hidden border border-medsol-blue/10">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                alt="Map Placeholder"
              />
              <div className="absolute inset-0 bg-medsol-blue/10 pointer-events-none" />
              <div className="absolute top-[38%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-6 h-6 bg-medsol-blue rounded-full animate-ping absolute" />
                <div className="w-6 h-6 bg-medsol-gold rounded-full relative z-10" />
                <span className="mt-4 text-[10px] tracking-[0.3em] uppercase bg-white px-4 py-2 font-bold shadow-2xl">Medsol Hub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BRAND SHOWCASE */}
      <section className="bg-bg-primary py-0 relative flex items-center justify-center overflow-hidden h-[70vh]">
        <Image src="/assets/images/Alhama-sunrise-52-scaled.webp" fill sizes="100vw" className="object-cover opacity-80" alt="Medsol Real Estate" />
        <div className="absolute inset-0 bg-medsol-blue/60 mix-blend-multiply pointer-events-none" />

        <div className="relative z-10 text-center space-y-6 max-w-5xl px-8 w-full">
          <h2 className="text-6xl md:text-8xl font-serif text-white">Medsol Real Estate</h2>
          <p className="text-lg md:text-xl text-white/90 font-light tracking-wide md:whitespace-nowrap">
            Curating the finest Mediterranean resort living experiences in Murcia, Spain.
          </p>
        </div>
      </section>

      {/* 9. LIFESTYLE / AMENITIES */}
      <section className="bg-bg-primary py-32 md:py-48 px-10">
        <div className="max-content">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="space-y-4">
              <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Resort Experience</span>
              <h2 className="text-5xl md:text-7xl font-serif italic">
                Exceptional <br /> Living Standards.
              </h2>
            </div>
            <p className="max-w-md text-text-secondary leading-loose font-light">
              We offer a lifestyle curated for the discerning. From world-class facilities to intimate services, every aspect is designed for ease and elegance.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-0.5 bg-white/5">
            {[
              { icon: Wind, title: "Wellness & Spa", desc: "Holistic treatments inspired by nature." },
              { icon: Sun, title: "Sun-Drenched Terraces", desc: "300+ days of Mediterranean sunshine." },
              { icon: Shield, title: "24/7 Concierge", desc: "Security and peace of mind, always." },
              { icon: Heart, title: "Clubhouse", desc: "Private social environments for residents." },
              { icon: MapPin, title: "Nature Trails", desc: "Direct access to the local Sierra landscapes." },
              { icon: Waves, title: "Infinity Pools", desc: "Individual and resort-wide aquatic features." },
              { icon: Settings, title: "Smart Living", desc: "The latest in home automation and tech." },
              { icon: Wind, title: "ESG Verified", desc: "Commitment to sustainable excellence." },
            ].map((item, i) => (
              <div key={i} className="bg-bg-primary p-12 space-y-6 hover:bg-medsol-blue transition-all duration-700 group cursor-default">
                <item.icon className="w-10 h-10 text-medsol-gold group-hover:text-white stroke-[1px] transition-colors" />
                <h4 className="text-[12px] tracking-[0.3em] uppercase font-bold group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-sm text-text-secondary group-hover:text-white/80 leading-relaxed font-light transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. MASTERPLAN SECTION */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text flex flex-col items-center">
        <div className="max-content text-center space-y-16">
          <div className="space-y-4">
            <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">Planned Excellence</span>
            <h2 className="text-6xl md:text-8xl font-serif italic">The Masterplan.</h2>
          </div>
          <div className="relative aspect-[16/6] w-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 cursor-zoom-in">
            <Image
              src="/assets/images/omala-residences-villa-antia-fachada-piscina-2.webp"
              fill
              sizes="100vw"
              className="object-cover object-bottom"
              alt="Masterplan"
            />
            <div className="absolute inset-0 bg-medsol-blue/5 pointer-events-none" />
          </div>
          <p className="max-w-2xl mx-auto text-section-light-text/60 leading-loose font-light italic text-xl">
            &quot;A vision of low-density living where architectural volume is balanced by natural void. This is the blueprint of a legacy.&quot;
          </p>
        </div>
      </section>

      {/* ADDITIONAL SERVICES SECTION */}
      <section className="bg-bg-primary py-32 md:py-48 luxury-border border-b">
        <div className="max-content">
          <div className="text-center mb-24 space-y-4">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Comprehensive Support</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">Additional Services</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-bg-secondary p-12 text-center space-y-6">
              <span className="text-[12px] tracking-[0.3em] uppercase font-bold block text-medsol-gold">Currency Exchange</span>
              <p className="text-sm text-text-secondary font-light">We can introduce you to specialized currency providers to secure the best rates for your property investment.</p>
            </div>
            <div className="bg-bg-secondary p-12 text-center space-y-6">
              <span className="text-[12px] tracking-[0.3em] uppercase font-bold block text-medsol-gold">Legal Advisors</span>
              <p className="text-sm text-text-secondary font-light">We can introduce you to Spanish property law specialists for a seamless and secure acquisition process.</p>
            </div>
            <div className="bg-bg-secondary p-12 text-center space-y-6">
              <span className="text-[12px] tracking-[0.3em] uppercase font-bold block text-medsol-gold">Relocation Support</span>
              <p className="text-sm text-text-secondary font-light">Comprehensive purchasing and relocation support to help you settle in effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CONTACT / INQUIRY SECTION */}
      <section id="contact" className="bg-bg-secondary py-32 md:py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-24">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Begin Your Journey</span>
                <h2 className="text-7xl font-serif leading-none italic">
                  Inquire with <br /> <span className="text-medsol-blue not-italic">Medsol.</span>
                </h2>
              </div>
              <p className="text-text-secondary leading-loose text-lg font-light">
                Our team of advisors are ready to guide you through the Medsol collection. Whether you seek the amplitude of Omala or the nature of Alhama, we have a place for you.
              </p>
              <div className="bg-bg-primary p-8 border-l-4 border-medsol-gold space-y-4">
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-medsol-gold">Immediate Assistance</p>
                <p className="text-2xl font-serif">
                  <a href="https://wa.me/447424864684" target="_blank" rel="noopener noreferrer" className="hover:text-medsol-gold transition-colors">
                    WhatsApp Advisor: 0044 7424 864 684
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-bg-primary/40 backdrop-blur-3xl p-12 md:p-16 border luxury-border space-y-10">
              <InquiryForm variant="contact" showCollectionSelect />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
