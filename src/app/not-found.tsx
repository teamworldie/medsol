import Link from "next/link";

// Root not-found: catches any URL that doesn't match a route at all. Route
// segments (like (site)'s own not-found.tsx) only activate for notFound()
// calls or child paths within that segment's rendered tree - a totally
// unmatched path falls back here instead, so this needs its own styling
// rather than relying on any layout to wrap it.
export default function RootNotFound() {
  return (
    <div className="medsol-site">
      <main className="bg-bg-primary min-h-screen flex items-center justify-center px-6 relative overflow-x-hidden">
        <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase block">Page Not Found</span>
          <h1 className="text-6xl md:text-8xl font-serif italic text-white">
            Lost in <br /> <span className="not-italic text-medsol-blue">Translation.</span>
          </h1>
          <p className="text-text-secondary text-lg font-light">
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
    </div>
  );
}
