import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import InquiryForm from "@/components/site/InquiryForm";
import Footer from "@/components/site/Footer";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Contact",
  description: "Connect with Medsol Real Estate. Our dedicated advisors are at your service for bespoke guidance on Murcia's finest resort residences.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: { url: `${SITE_URL}/contact` },
};

export default function Contact() {
  return (
    <main className="bg-bg-primary pt-32 relative overflow-x-hidden">
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />

      <section className="py-24 relative z-10">
        <div className="max-content">
          <div className="max-w-4xl mx-auto space-y-24">
            <div className="space-y-8 text-center flex flex-col items-center">
              <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase block">Connect with Medsol</span>
              <h1 className="text-5xl md:text-8xl font-serif leading-none italic text-shadow-luxury">
                Begin your <br /> <span className="not-italic text-medsol-blue">Legacy.</span>
              </h1>
              <p className="text-text-secondary leading-loose font-light max-w-2xl text-lg mx-auto">
                Whether you are seeking a primary residence or a strategic investment, our dedicated advisors are at your service to provide bespoke guidance.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-16 pt-8">
              <div className="space-y-6 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-4 text-medsol-gold">
                  <MapPin className="w-6 h-6 stroke-[1px]" />
                  <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">Head Office</h4>
                </div>
                <p className="text-text-secondary text-sm font-light leading-relaxed">
                  Company number 126457<br />
                  Medsol Real Estate Limited.<br />
                  Unit G02, Eurocity<br />
                  Europort Avenue<br />
                  Gibraltar<br />
                  GX11 1AA
                </p>
              </div>
              <div className="space-y-6 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-4 text-medsol-gold">
                  <Phone className="w-6 h-6 stroke-[1px]" />
                  <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">Inquiries</h4>
                </div>
                <div className="space-y-2 font-light text-sm">
                  <p className="text-text-secondary">info@medsolrealestate.com</p>
                  <a href="https://wa.me/447424864684" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-medsol-gold transition-colors block">
                    WhatsApp: 0044 7424 864 684
                  </a>
                </div>
              </div>
              <div className="space-y-6 flex flex-col items-center text-center">
                <div className="flex flex-col items-center gap-4 text-medsol-gold">
                  <Clock className="w-6 h-6 stroke-[1px]" />
                  <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white">Opening Hours</h4>
                </div>
                <p className="text-text-secondary text-sm font-light leading-relaxed">
                  Monday — Friday<br />
                  09:00 — 19:00
                </p>
              </div>
            </div>

            <div id="contact" className="bg-bg-secondary/80 backdrop-blur-sm p-12 lg:p-16 border border-white/10 relative max-w-3xl mx-auto w-full">
              <h3 className="text-3xl font-serif mb-12 text-white">Submit Interest</h3>
              <InquiryForm variant="contact" showCollectionSelect />
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="MEDSOL · Luxury Real Estate." />
    </main>
  );
}
