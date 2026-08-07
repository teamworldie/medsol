import type { Metadata } from "next";
import Footer from "@/components/site/Footer";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Legal Information",
  alternates: { canonical: `${SITE_URL}/legal-info` },
};

export default function LegalInfo() {
  return (
    <main className="bg-bg-primary pt-32 relative overflow-x-hidden">
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />

      <section className="py-24 relative z-10">
        <div className="max-content">
          <div className="max-w-4xl mx-auto space-y-12">
            <h1 className="text-4xl md:text-6xl font-serif text-white">Legal Information</h1>
            <div className="text-text-secondary space-y-6 font-light leading-relaxed">
              <p>Please read these Terms and Conditions carefully before using the Medsol Real Estate website.</p>

              <h2 className="text-2xl font-serif text-white pt-8">Terms of Use</h2>
              <p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use Medsol Real Estate if you do not agree to take all of the terms and conditions stated on this page.</p>

              <h2 className="text-2xl font-serif text-white pt-8">Disclaimer</h2>
              <p>The materials on Medsol Real Estate&apos;s website are provided on an &apos;as is&apos; basis. Medsol Real Estate makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="MEDSOL · Legal." />
    </main>
  );
}
