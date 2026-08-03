"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Property } from "@prisma/client";
import InquiryForm from "@/components/site/InquiryForm";

export default function VillaDetailView({ property, gallery }: { property: Property; gallery: string[] }) {
  const router = useRouter();
  const galleryRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: "left" | "right") => {
    if (galleryRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 800 : 300;
      galleryRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {property.featuredImage && (
            <img src={property.featuredImage} alt={property.title} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17]/80 via-[#0a0e17]/40 to-bg-primary" />
        </div>

        <div className="relative z-10 text-center max-content w-full mt-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="space-y-6">
            <button onClick={() => router.back()} className="text-medsol-gold text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-4 mx-auto hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <h1 className="text-5xl md:text-8xl font-serif leading-none text-white italic">{property.title}</h1>
            {property.community && <span className="text-medsol-gold text-[12px] tracking-[0.4em] uppercase block pt-4">{property.community}</span>}
          </motion.div>
        </div>
      </section>

      {/* INTRO & SPECS SECTION */}
      <section className="py-24 relative z-10 border-b border-white/5">
        <div className="max-content">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase font-bold">The Vision</span>
              <h2 className="text-4xl md:text-6xl font-serif italic text-white">
                Architectural <br /> <span className="not-italic text-medsol-blue">Elegance.</span>
              </h2>
              <p className="text-text-secondary leading-loose text-lg font-light">{property.description}</p>
            </div>

            {/* Quick Facts */}
            <div className="bg-bg-secondary p-6 md:p-12 border border-white/5 space-y-8 relative overflow-hidden group min-w-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-medsol-gold/5 rounded-full blur-3xl group-hover:bg-medsol-gold/10 transition-colors pointer-events-none" />
              <h3 className="text-2xl font-serif text-white border-b border-white/10 pb-6 relative z-10">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 md:gap-8 relative z-10">
                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-text-secondary">Bedrooms</span>
                  <p className="text-2xl font-serif text-white">{property.bedrooms}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-text-secondary">Bathrooms</span>
                  <p className="text-2xl font-serif text-white">{property.bathrooms}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-text-secondary">Build Size</span>
                  <p className="text-2xl font-serif text-white">{property.area}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-text-secondary">Plot Size</span>
                  <p className="text-2xl font-serif text-white">{property.landArea}</p>
                </div>
              </div>
              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-8 justify-between items-start sm:items-center relative z-10">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-text-secondary block mb-2">Starting From</span>
                  <p className="text-3xl font-serif text-medsol-gold">{property.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      {gallery.length > 0 && (
        <section className="py-24 relative z-10 border-b border-white/5 overflow-hidden">
          <div className="max-content mb-12 flex justify-between items-end">
            <div>
              <span className="text-medsol-gold text-[10px] tracking-[0.4em] uppercase font-bold mb-4 block">Visual Tour</span>
              <h3 className="text-4xl md:text-5xl font-serif text-white">Gallery</h3>
            </div>
            <div className="flex gap-4">
              <button onClick={() => scrollGallery("left")} className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-medsol-gold text-white hover:text-medsol-gold transition-colors rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => scrollGallery("right")} className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-medsol-gold text-white hover:text-medsol-gold transition-colors rounded-full">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div ref={galleryRef} className="w-full overflow-x-auto snap-x snap-mandatory flex gap-6 px-8 md:px-[calc((100vw-1200px)/2)] lg:px-[calc((100vw-1400px)/2)] pb-8 hide-scrollbar">
            {gallery.map((img, idx) => (
              <div key={idx} className="snap-center shrink-0 w-[85vw] md:w-[60vw] lg:w-[900px] aspect-[16/9] relative group overflow-hidden rounded-xl border border-white/5">
                <img src={img} alt={`${property.title} Gallery Image ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 relative z-10">
        <div className="max-content max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-medsol-gold text-[10px] tracking-[0.4em] uppercase font-bold mb-4 block">Take the next step</span>
            <h3 className="text-4xl md:text-5xl font-serif text-white">Request Floorplans & Pricing</h3>
          </div>
          <div className="bg-bg-secondary p-10 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-medsol-blue/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <InquiryForm variant="villa" propertyId={property.id} inquiryType={property.community ?? undefined} buttonLabel="Send Message" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
