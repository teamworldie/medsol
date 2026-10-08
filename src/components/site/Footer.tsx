import Link from "next/link";
import Image from "next/image";
import { SOCIAL_PROFILES, type SocialNetwork } from "@/lib/siteConfig";

// Brand glyphs drawn inline: lucide-react no longer ships brand/logo icons
// (same approach as ShareBar).
const SOCIAL_ICON_PATHS: Record<SocialNetwork, string> = {
  Instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  Facebook:
    "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z",
  TikTok:
    "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .59.04.86.13V9.4a6.34 6.34 0 0 0-.86-.06A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1.84-.07z",
  YouTube:
    "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z",
};

export default function Footer({ tagline = "MEDSOL · GLOBAL EXCELLENCE." }: { tagline?: string }) {
  return (
    <footer className="bg-bg-primary py-24 border-t border-medsol-blue/10 z-10 relative mt-auto">
      <div className="max-content flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="space-y-4 text-center md:text-left">
          <Image
            src="/assets/images/medsol-logo-light.webp"
            alt="Medsol"
            width={148}
            height={32}
            className="h-8 w-auto mx-auto md:mx-0"
          />
          <div className="text-[10px] tracking-[0.2em] uppercase text-text-secondary font-light space-y-2 mt-4">
            <p>Company number 126457</p>
            <p>Medsol Real Estate Limited.</p>
            <p>Unit G02, Eurocity</p>
            <p>Europort Avenue</p>
            <p>Gibraltar</p>
            <p>GX11 1AA</p>
            <p>info@medsolrealestate.com</p>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end mt-8 md:mt-0 gap-2">
          <ul className="flex items-center gap-5 mb-4" aria-label="Medsol on social media">
            {SOCIAL_PROFILES.map(({ name, url }) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Medsol Real Estate on ${name}`}
                  className="text-text-secondary hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d={SOCIAL_ICON_PATHS[name]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[10px] tracking-[0.2em] uppercase text-text-secondary font-light text-center md:text-right">
            © {new Date().getFullYear()} {tagline}
          </p>
          <Link
            href="/privacy-policy"
            className="text-[10px] tracking-[0.2em] uppercase text-text-secondary hover:text-white transition-colors font-light text-center md:text-right"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
