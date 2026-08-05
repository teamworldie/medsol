import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-bg-primary min-h-screen flex items-center justify-center pt-32 pb-24 relative overflow-x-hidden">
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />
      <div className="max-content relative z-10 text-center space-y-8">
        <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase block">Page Not Found</span>
        <h1 className="text-6xl md:text-8xl font-serif italic text-white">
          Lost in <br /> <span className="not-italic text-medsol-blue">Translation.</span>
        </h1>
        <p className="text-text-secondary text-lg font-light max-w-xl mx-auto">
          The page you&apos;re looking for doesn&apos;t exist, or may have moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-4 text-[11px] tracking-[0.3em] uppercase bg-medsol-blue px-10 py-5 hover:bg-medsol-blue-light transition-all duration-500"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
