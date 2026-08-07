import type { Metadata } from "next";
import Footer from "@/components/site/Footer";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Cookie Policy",
  alternates: { canonical: `${SITE_URL}/cookies` },
};

export default function Cookies() {
  return (
    <main className="bg-bg-primary pt-32 relative overflow-x-hidden">
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />

      <section className="py-24 relative z-10">
        <div className="max-content">
          <div className="max-w-4xl mx-auto space-y-12">
            <h1 className="text-4xl md:text-6xl font-serif text-white">Cookie Policy</h1>
            <div className="text-text-secondary space-y-6 font-light leading-relaxed">
              <p>This Cookie Policy explains how Medsol Real Estate uses cookies and similar technologies to recognize you when you visit our website.</p>

              <h2 className="text-2xl font-serif text-white pt-8">What are cookies?</h2>
              <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>

              <h2 className="text-2xl font-serif text-white pt-8">Why do we use cookies?</h2>
              <p>We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Websites to operate, and we refer to these as &quot;essential&quot; or &quot;strictly necessary&quot; cookies.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="MEDSOL · Legal." />
    </main>
  );
}
