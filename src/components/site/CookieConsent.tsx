"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-Q3ZQJ5MH7T";
const CONSENT_KEY = "medsol-cookie-consent";

type Consent = "accepted" | "declined" | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Reading localStorage - a real external/browser API unavailable during
    // SSR - not prop-derived state, so this can't be adjusted during render
    // the way the codebase's other setState-in-effect cases are.
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "declined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConsent(stored);
    } else {
      setShowBanner(true);
    }
  }, []);

  const choose = (value: "accepted" | "declined") => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setShowBanner(false);
  };

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      )}

      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-[70] bg-bg-secondary border-t border-white/10 px-6 py-6 md:px-12">
          <div className="max-content flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-text-secondary font-light text-center md:text-left">
              We use cookies to understand how visitors use our site and improve your experience. See our{" "}
              <Link href="/cookies" className="text-medsol-gold hover:text-white transition-colors underline">
                Cookie Policy
              </Link>{" "}
              for details.
            </p>
            <div className="flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => choose("declined")}
                className="px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-text-secondary hover:text-white transition-colors"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="px-6 py-3 border border-medsol-gold text-[10px] tracking-[0.2em] uppercase text-medsol-gold hover:bg-medsol-gold hover:text-bg-primary transition-all duration-500"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
