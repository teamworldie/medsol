import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getPropertiesByCommunity, COMMUNITIES } from "@/lib/properties";
import InquiryForm from "@/components/site/InquiryForm";
import Footer from "@/components/site/Footer";
import StatusBadge from "@/components/site/StatusBadge";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Corvera Hills",
  description: "Corvera Hills — pure life, pure home. New-build opportunities in Corvera Hills, Murcia.",
  alternates: { canonical: `${SITE_URL}/corvera` },
  openGraph: { url: `${SITE_URL}/corvera` },
};

export default async function Corvera() {
  const villas = await getPropertiesByCommunity(COMMUNITIES.corvera);

  return (
    <main className="bg-bg-primary overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
            <source src="/assets/videos/VÍDEO PROMOCIONAL NO LOGOS junio 2026.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0a0e17]/70" />
        </div>

        <div className="relative z-10 text-center max-content">
          <div className="space-y-6">
            <span className="text-medsol-gold text-[12px] tracking-[0.5em] uppercase mb-4 block">New-build opportunities in Corvera Hills</span>
            <h1 className="text-5xl md:text-8xl font-serif leading-none italic text-shadow-luxury">
              Pure life. <br /> <span className="not-italic text-medsol-gold-soft">Pure home.</span>
            </h1>
            <p className="text-[14px] tracking-[0.4em] uppercase text-text-secondary mt-8">Discover our new development</p>
          </div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text relative overflow-hidden">
        <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10 text-center space-y-12">
          <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">A place to belong</span>
          <h2 className="text-4xl md:text-6xl font-serif italic max-w-4xl mx-auto leading-relaxed">
            &quot;Our homes are not measured in square metres, but in experiences.&quot;
          </h2>
          <p className="text-xl leading-relaxed text-section-light-text/70 font-light max-w-3xl mx-auto">
            Designed with elegance and functionality at their core, each build brings together modern architecture, natural light and the seclusion of a private resort. Explore exclusive accommodation options close to our golf course, perfect as a second home or for a new beginning.
          </p>
        </div>
      </section>

      {/* 3. LIFESTYLE SECTION */}
      <section className="bg-bg-primary py-32 md:py-48 border-y luxury-border bg-pattern relative">
        <div className="max-content grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">The Lifestyle</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">
              Over and above golf, <br /> <span className="not-italic text-medsol-gold-soft">it&rsquo;s a lifestyle choice</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed font-light">
              At the heart of the Region of Murcia, Corvera Hills Golf offers a unique experience where golf and nature blend together in perfect harmony. A Mediterranean golf resort surrounded by mountains, warmed by the sun and designed for you to enjoy every swing.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed font-light">
              Here you have the chance to truly get into the game, the game of reconnecting with yourself, with nature, and with the authentic life that you long for. It is the ideal venue for golfers of all levels who are looking for a quiet and sustainable location tucked into an area of natural beauty in Murcia. Pure life. Pure golf.
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden group">
            <Image
              src="/assets/images/DSC8367@05x.webp"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[2s] group-hover:scale-110"
              alt="Golf Lifestyle"
            />
            <div className="absolute inset-0 bg-medsol-blue/20 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 4. ACCOMMODATION OPTIONS */}
      <section className="bg-bg-secondary py-32 md:py-48">
        <div className="max-content">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-8">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Property Collection</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">
              Explore <span className="text-medsol-gold-soft not-italic">Corvera Hills Golf</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {villas.map((villa) => (
              <Link href={`/property/${villa.slug}`} key={villa.id} className="group cursor-pointer block">
                <div className="aspect-video overflow-hidden relative mb-8">
                  <Image
                    src={villa.featuredImage ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                    alt={villa.title}
                  />
                  <div className="absolute inset-0 bg-medsol-blue/40 group-hover:bg-medsol-blue/10 transition-colors z-10" />
                  <StatusBadge status={villa.status} className="absolute top-4 right-4 z-20" />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <h4 className="text-3xl font-serif group-hover:text-medsol-gold transition-colors">{villa.title}</h4>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-text-secondary group-hover:text-white transition-colors">From {villa.price}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-medsol-gold flex items-center justify-center group-hover:bg-medsol-gold transition-colors shrink-0">
                    <ArrowRight className="w-5 h-5 text-medsol-gold group-hover:text-bg-primary transition-colors" />
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <p className="text-text-secondary font-light text-sm leading-relaxed group-hover:text-white/80 transition-colors">{villa.description}</p>
                  <div className="flex flex-wrap gap-4 text-[10px] tracking-[0.2em] uppercase text-medsol-gold">
                    <span>{villa.bedrooms} Beds</span>
                    <span className="text-white/20">|</span>
                    <span>{villa.bathrooms} Baths</span>
                    <span className="text-white/20">|</span>
                    <span>From {villa.area}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BUILD THE LIFE YOU CHOOSE */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text border-b luxury-border relative overflow-hidden">
        <div className="max-content">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative group overflow-hidden h-full min-h-[400px]">
              <div className="w-full h-full absolute inset-0">
                <Image
                  src="/assets/images/Corvera - Aneas Villas/Aneas_aerea.webp"
                  alt="Mediterranean lifestyle"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 border-[20px] border-[#387262]/20 pointer-events-none" />
            </div>
            <div className="space-y-8">
              <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">Build the life you choose</span>
              <h2 className="text-3xl md:text-5xl lg:text-[3.2rem] font-serif italic leading-[1.1]">
                <span className="block text-[0.85em]">A Mediterranean lifestyle</span>
                <span className="block text-medsol-gold not-italic">with the added benefit</span>
                <span className="block text-medsol-gold not-italic">of seclusion and security.</span>
              </h2>
              <p className="text-lg leading-relaxed text-section-light-text/70 font-light">
                Corvera Hills Residences invite you to live the life you have always dreamed of: with greater freedom, more comfort, and a deeper connection to the surroundings.
              </p>
              <p className="text-lg leading-relaxed text-section-light-text/70 font-light">
                In the Region of Murcia, where the sun shines more than 300 days a year, you will discover a truly Mediterranean lifestyle enveloped by nature, local gastronomic delights and a welcoming international community.
              </p>
              <p className="text-lg leading-relaxed text-section-light-text/70 font-light">
                Our exclusive homes in Murcia, in the beautifully tranquil and natural surroundings of the El Valle y Carrascoy Regional Park, are much more than just a place to live. They offer a new way of life, where you can truly enjoy the now and experience freedom. At Corvera Hills you will find the perfect balance between well-being, culture and quality of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. READY TO START */}
      <section className="bg-bg-primary py-32 md:py-48 luxury-border border-b">
        <div className="max-content text-center space-y-12">
          <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase font-bold">Ready to start creating the life you choose?</span>
          <h2 className="text-5xl md:text-7xl font-serif italic max-w-4xl mx-auto">
            At Corvera Hills Residences <br /> <span className="text-medsol-gold-soft not-italic">we build homes with soul.</span>
          </h2>
          <p className="text-text-secondary text-xl leading-relaxed font-light max-w-3xl mx-auto">
            With attention to every detail, our designs speak of elegance and serenity. We are a Real Estate agency based in Corvera, Murcia, specialising in international clients and exclusive homes from home. We are committed to listening closely, understanding your needs and guiding you on every step of the way.
          </p>
        </div>
      </section>

      {/* 7. FINAL CONTACT */}
      <section id="contact" className="bg-bg-primary py-32 md:py-48 border-t border-white/5 relative">
        <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">The Lifestyle Awaits</span>
            <h2 className="text-5xl md:text-8xl font-serif italic mb-8">
              Secure Your Place <br /> <span className="not-italic text-medsol-blue">at Corvera Hills.</span>
            </h2>
            <p className="text-text-secondary text-xl leading-relaxed font-light max-w-2xl">
              Our advisors will guide you through the available units and payment options tailored to your needs.
            </p>

            <div className="w-full max-w-2xl pt-12">
              <InquiryForm variant="villa" inquiryType="Corvera" />
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="MEDSOL · Corvera Hills." />
    </main>
  );
}
