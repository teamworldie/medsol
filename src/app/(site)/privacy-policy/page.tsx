import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Footer from "@/components/site/Footer";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function PrivacyPolicy() {
  const privacyHtml = fs.readFileSync(path.join(process.cwd(), "src/content/privacy.txt"), "utf-8");

  return (
    <main className="bg-bg-primary pt-32 relative overflow-x-hidden">
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />

      <section className="py-24 relative z-10">
        <div className="max-content">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-white p-8 md:p-12 rounded-lg text-black overflow-hidden privacy-content">
              <div dangerouslySetInnerHTML={{ __html: privacyHtml }} />
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="MEDSOL · Legal." />
    </main>
  );
}
