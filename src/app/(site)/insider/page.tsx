import type { Metadata } from "next";
import InsiderForm from "@/components/site/InsiderForm";
import Footer from "@/components/site/Footer";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Stay in Touch",
  description: "Thinking about a golf home in Murcia? Leave your details and Lee Doherty will keep you posted on new releases, buying tips and viewing trips.",
  alternates: { canonical: `${SITE_URL}/insider` },
  openGraph: { url: `${SITE_URL}/insider` },
};

export default async function InsiderPage({ searchParams }: { searchParams: Promise<{ src?: string }> }) {
  const { src } = await searchParams;
  return (
    <main className="bg-bg-primary pt-32 relative overflow-x-hidden">
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />
      <section className="py-24 relative z-10">
        <div className="max-content">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="space-y-6 text-center">
              <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase block">Stay in touch</span>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight italic text-white md:whitespace-nowrap">Thinking about a home in Murcia?</h1>
              <p className="text-text-secondary leading-loose font-light text-lg max-w-3xl mx-auto">
                Join the list for new releases, guides and sunny Murcia living, sent by Lee and the MedSol team.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "New Releases", text: "A first look at new homes and price lists." },
                { title: "Buying Tips", text: "Practical guidance on costs and the legal side." },
                { title: "Viewing Trips", text: "Invitations to viewing trips and resort events." },
              ].map((b) => (
                <div key={b.title} className="border border-white/10 bg-bg-secondary/40 p-8 text-center space-y-3">
                  <div className="w-8 h-px bg-medsol-gold mx-auto" />
                  <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-medsol-gold">{b.title}</h3>
                  <p className="text-white/80 font-light text-sm leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-bg-secondary/80 backdrop-blur-sm p-10 lg:p-12 border border-white/10 max-w-2xl mx-auto">
              <InsiderForm channel={typeof src === "string" ? src : "direct"} />
            </div>
          </div>
        </div>
      </section>
      <Footer tagline="MEDSOL · Stay in touch." />
    </main>
  );
}
