import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Waves, Sun, Mountain, MapPin } from "lucide-react";
import { getPropertiesByCommunity, COMMUNITIES } from "@/lib/properties";
import InquiryForm from "@/components/site/InquiryForm";
import Footer from "@/components/site/Footer";
import StatusBadge from "@/components/site/StatusBadge";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alhama Nature",
  description: "Alhama Nature — embrace nature and golf, nestled around a Jack Nicklaus signature golf course in Murcia.",
  alternates: { canonical: `${SITE_URL}/alhama-nature` },
  openGraph: { url: `${SITE_URL}/alhama-nature` },
};

export default async function AlhamaNature() {
  const villas = await getPropertiesByCommunity(COMMUNITIES.alhama);

  return (
    <main className="bg-bg-primary overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/assets/images/Alhama-sunset-148-1024x682.webp"
            alt="Alhama Nature Sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-[#0a0e17]/70" />
        </div>

        <div className="relative z-10 text-center max-content">
          <div className="space-y-6">
            <span className="text-medsol-gold text-[12px] tracking-[0.5em] uppercase mb-4 block">Alhama Nature</span>
            <h1 className="text-5xl md:text-8xl font-serif leading-none italic text-shadow-luxury">
              The Life You <br /> <span className="not-italic text-medsol-gold-soft">Deserve.</span>
            </h1>
            <p className="text-[14px] tracking-[0.4em] uppercase text-text-secondary mt-8">A natural paradise · Mediterranean Lifestyle</p>
          </div>
        </div>
      </section>

      {/* 2. THE COMMUNITY (LIGHT SECTION) */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text relative overflow-hidden">
        <div className="bg-noise absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-last lg:order-first relative group overflow-hidden aspect-square">
              <Image
                src="/assets/images/Alhama-sunset-32-qyk0bjd420k5mb4uif4uz8v7akailj70lczx644m1s.webp"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Golf Village"
              />
              <div className="absolute inset-0 border-[20px] border-[#387262]/20 pointer-events-none" />
            </div>
            <div className="space-y-12">
              <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">The Alhama Vision</span>
              <h2 className="text-6xl md:text-8xl font-serif italic leading-none">
                Nature & <br /> <span className="text-medsol-gold not-italic">Golf.</span>
              </h2>
              <p className="text-xl leading-relaxed text-section-light-text/70 font-light max-w-lg">
                Enjoy an exclusive world-class Signature Golf Club, just a few minutes from the Sierra de Espuña mountain range and its hiking trails, and very close to the best beaches of Mazarrón.
              </p>
              <div className="italic text-2xl text-medsol-blue/80 border-l-4 border-medsol-gold pl-8 py-2 font-serif">
                &quot;A sanctuary of peace and fun where you can establish the home you deserve.&quot;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIFESTYLE GRID */}
      <section className="bg-bg-primary py-32 md:py-48 border-y luxury-border bg-pattern">
        <div className="max-content">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-8">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">The Resort Experience</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">Curated Living</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-0.5 bg-white/5">
            {[
              { icon: Sun, title: "300+ Days of Sun", desc: "A climate designed for outdoor pursuits." },
              { icon: Waves, title: "Wellness Hub", desc: "Private pools and spa facilities for residents." },
              { icon: Mountain, title: "Natural Sierra", desc: "Surrounded by protected mountain landscapes." },
              { icon: MapPin, title: "Proximity", desc: "25 minutes to the Mediterranean coastline." },
              { icon: Waves, title: "Water Features", desc: "Meandering streams and aquatic design." },
              { icon: ArrowRight, title: "18-Hole Golf", desc: "Strategic play integrated with residential zones." },
            ].map((item, i) => (
              <div key={i} className="bg-bg-primary p-16 space-y-6 hover:bg-[#2c4a2e] transition-all duration-700 group cursor-default">
                <item.icon className="w-12 h-12 text-medsol-gold group-hover:text-white stroke-[1px] transition-colors" />
                <h4 className="text-[12px] tracking-[0.3em] uppercase font-bold group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-sm text-text-secondary group-hover:text-white/80 leading-relaxed font-light transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROPERTY COLLECTIONS */}
      <section className="bg-bg-secondary py-32 md:py-48">
        <div className="max-content">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
            <div className="space-y-4">
              <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">Property Collection</span>
              <h2 className="text-5xl md:text-7xl font-serif italic">
                Find Your <br /> <span className="text-medsol-gold-soft not-italic">Corner of Paradise.</span>
              </h2>
            </div>
            <p className="max-w-md text-text-secondary leading-loose font-light">
              From intimate apartments to grand signature villas, Alhama offers architectural diversity unified by a single vision of quality and sustainability.
            </p>
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
                  <div className="absolute inset-0 bg-medsol-blue/40 group-hover:bg-medsol-blue/10 transition-colors" />
                  <StatusBadge status={villa.status} className="absolute top-4 right-4" />
                </div>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h4 className="text-3xl font-serif">{villa.title}</h4>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-text-secondary">From {villa.price}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-medsol-gold flex items-center justify-center group-hover:bg-medsol-gold transition-colors">
                    <ArrowRight className="w-5 h-5 text-medsol-gold group-hover:text-bg-primary transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GOLF STATS (LIGHT) */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text flex flex-col items-center">
        <div className="max-content text-center space-y-24">
          <div className="space-y-4">
            <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">Alhama Signature Golf</span>
            <h2 className="text-6xl md:text-8xl font-serif italic">
              A Masterpiece by <br /> Jack Nicklaus.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
            {[
              { val: "18", label: "Holes" },
              { val: "5", label: "Lakes" },
              { val: "116", label: "Bunkers" },
              { val: "Fast", label: "Greens" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-4 border-l border-medsol-gold pl-6 md:pl-10 text-left">
                <span className="text-4xl font-serif text-medsol-blue">{stat.val}</span>
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold block">{stat.label}</span>
              </div>
            ))}
          </div>

          <p className="max-w-3xl mx-auto text-xl italic font-serif leading-relaxed text-section-light-text/60">
            &quot;I have designed Alhama Signature Golf as a course to have fun, not to punish yourself, although you have to put some sparkle in it.&quot; — Jack Nicklaus
          </p>
        </div>
      </section>

      {/* 5.1 NOSTRUM LIVING */}
      <section className="bg-bg-primary py-32 md:py-48 luxury-border border-b">
        <div className="max-content">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase font-bold">Nostrum Living</span>
              <h2 className="text-5xl md:text-7xl font-serif italic">Senior Living Homes.</h2>
              <p className="text-text-secondary text-lg leading-relaxed font-light">
                A space designed to offer you maximum wellbeing. Unique, high quality homes, with all the comforts: full kitchen, terrace, dressing room, air conditioning, central heating, cleaning, laundry and private parking.
              </p>
              <p className="text-text-secondary text-lg leading-relaxed font-light">
                Enjoy personalised services such as medical care, nutrition, physiotherapy, wellness programmes, and outdoor sports activities. All designed to take care of your physical and mental health.
              </p>
            </div>
            <div className="relative aspect-square overflow-hidden group">
              <Image
                src="/assets/images/K_2vZcSg.webp"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt="Nostrum Living"
              />
              <div className="absolute inset-0 bg-medsol-blue/20" />
            </div>
          </div>
        </div>
      </section>

      {/* 5.2 FORTHCOMING PROJECTS */}
      <section className="bg-section-light py-32 md:py-48 text-section-light-text border-b luxury-border">
        <div className="max-content">
          <div className="text-center mb-24 space-y-4">
            <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase font-bold">The Future</span>
            <h2 className="text-5xl md:text-7xl font-serif italic">Forthcoming Projects</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {[
              { title: "Al Khasar", desc: "Our food court and shops. From cafés to restaurants, offering a wide range of options for all tastes." },
              { title: "Alhama Arena", desc: "A sports complex with six natural grass football pitches and a stadium for 3,500 spectators. Opening in 2025." },
              { title: "Alhama Nature Hotels", desc: "Two luxury hotels with a capacity of around 30,000 overnight stays per year." },
              { title: "Alhama Nature Club", desc: "Our Social Club, the social heart of our project, designed to foster the life and experiences of our residents." },
            ].map((proj) => (
              <div key={proj.title} className="bg-white p-12 space-y-6 hover:shadow-2xl transition-all duration-500">
                <h4 className="text-2xl font-serif text-medsol-blue">{proj.title}</h4>
                <p className="text-section-light-text/70 leading-relaxed font-light">{proj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CONTACT */}
      <section id="contact" className="bg-bg-primary py-32 md:py-48 border-t border-white/5 relative">
        <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-content relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase">The Lifestyle Awaits</span>
            <h2 className="text-5xl md:text-8xl font-serif italic mb-8">
              Secure Your Place <br /> <span className="not-italic text-medsol-blue">at Alhama.</span>
            </h2>
            <p className="text-text-secondary text-xl leading-relaxed font-light max-w-2xl">
              Our advisors will guide you through the available units and payment options tailored to your needs.
            </p>

            <div className="w-full max-w-2xl pt-12">
              <InquiryForm variant="villa" inquiryType="Alhama" />
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="MEDSOL · Alhama Nature." />
    </main>
  );
}
