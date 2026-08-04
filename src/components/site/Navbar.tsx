"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "HOME" },
  { href: "/omala-residences", label: "OMALA" },
  { href: "/alhama-nature", label: "ALHAMA" },
  { href: "/corvera", label: "CORVERA" },
  { href: "/journal", label: "JOURNAL" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes. Adjusting state during
  // render (rather than in an effect) avoids the extra cascading render pass.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const enquireHref = pathname === "/" || pathname.startsWith("/villa") || pathname.startsWith("/property") ? "#contact" : "/#contact";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-700 px-8 md:px-16 py-6 md:py-8 flex justify-between items-center",
          isScrolled ? "bg-bg-primary/90 backdrop-blur-md py-4 md:py-5 border-b border-white/5" : "bg-transparent"
        )}
      >
        <Link href="/" className="flex items-center group">
          <img
            src="/assets/images/medsol-logo-light.webp"
            alt="Medsol"
            className="h-10 w-auto transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="hidden md:flex items-center gap-12">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[10px] tracking-[0.3em] uppercase font-medium transition-all duration-500 hover:text-medsol-gold",
                pathname === link.href ? "text-medsol-gold" : "text-text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-4 ml-4">
            <a
              href={enquireHref}
              className="px-6 py-2 border border-medsol-gold text-[10px] tracking-[0.2em] uppercase text-medsol-gold hover:bg-medsol-gold hover:text-bg-primary transition-all duration-500"
            >
              Enquire
            </a>
          </div>
        </div>

        <button
          className="md:hidden fixed top-6 right-8 flex flex-col items-end justify-center w-8 h-8 gap-2 z-[60]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <div className={cn("h-[1px] bg-text-primary transition-all duration-300", isMobileMenuOpen ? "w-6 rotate-45 translate-y-[9px]" : "w-6")} />
          <div className={cn("h-[1px] bg-text-primary transition-all duration-300", isMobileMenuOpen ? "w-0 opacity-0" : "w-4")} />
          <div className={cn("h-[1px] bg-text-primary transition-all duration-300", isMobileMenuOpen ? "w-6 -rotate-45 -translate-y-[9px]" : "w-0 opacity-0")} />
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[55] bg-bg-primary flex flex-col items-center justify-center gap-8"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xl tracking-[0.3em] uppercase font-medium transition-colors",
                  pathname === link.href ? "text-medsol-gold" : "text-text-primary"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={enquireHref}
              className="mt-8 px-10 py-4 border border-medsol-gold text-sm tracking-[0.2em] uppercase text-medsol-gold hover:bg-medsol-gold hover:text-bg-primary transition-all duration-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Enquire
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
