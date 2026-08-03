import Link from "next/link";

export default function Footer({ tagline = "MEDSOL · GLOBAL EXCELLENCE." }: { tagline?: string }) {
  return (
    <footer className="bg-bg-primary py-24 border-t border-medsol-blue/10 z-10 relative mt-auto">
      <div className="max-content flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="space-y-4 text-center md:text-left">
          <img src="/assets/images/medsol-logo-light.webp" alt="Medsol" className="h-8 w-auto mx-auto md:mx-0" />
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
