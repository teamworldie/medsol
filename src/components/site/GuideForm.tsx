"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitGuideLead, type GuideFormState } from "@/app/actions/guideLead";
import type { Guide } from "@/lib/guides";

const initialState: GuideFormState = { success: false };

const fieldClass =
  "w-full bg-transparent border-b border-white/10 py-2 focus:border-medsol-gold transition-all outline-none font-light text-white";
const labelClass = "text-[10px] tracking-[0.2em] uppercase text-text-secondary group-focus-within:text-medsol-gold transition-colors";

const TIMELINES = ["Within 3 months", "3–6 months", "6–12 months", "Over 12 months", "Just researching"];

export default function GuideForm({ guide }: { guide: Guide }) {
  const [state, formAction, isPending] = useActionState(submitGuideLead, initialState);
  const link = useRef<HTMLAnchorElement>(null);

  // Start the download as soon as the lead is saved; the button below is the
  // fallback if the browser blocks the automatic one.
  useEffect(() => {
    if (state.success) link.current?.click();
  }, [state.success]);

  if (state.success && state.downloadUrl) {
    return (
      <div className="text-center py-10 space-y-6">
        <p className="text-medsol-gold text-2xl font-serif">Thank you. Your guide is downloading.</p>
        <p className="text-text-secondary font-light">If it doesn&apos;t start, use the button below.</p>
        <a
          ref={link}
          href={state.downloadUrl}
          download={state.downloadName}
          className="inline-block px-10 py-5 bg-medsol-blue text-white text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-medsol-gold transition-all duration-700"
        >
          Download the guide (PDF)
        </a>
        <p className="text-text-secondary text-sm font-light pt-4">
          Questions as you read? Message Lee on{" "}
          <a href="https://wa.me/447424864684" target="_blank" rel="noopener noreferrer" className="text-medsol-gold underline">
            WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="guide" value={guide.slug} />
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="space-y-2 group">
        <label className={labelClass} htmlFor="guide-name">Full Name</label>
        <input id="guide-name" type="text" name="fullName" required className={fieldClass} />
      </div>
      <div className="space-y-2 group">
        <label className={labelClass} htmlFor="guide-email">Email Address</label>
        <input id="guide-email" type="email" name="email" required className={fieldClass} />
      </div>
      <div className="space-y-2 group">
        <label className={labelClass} htmlFor="guide-phone">WhatsApp Number</label>
        <input id="guide-phone" type="tel" name="phone" placeholder="+44 …" className={`${fieldClass} placeholder:text-white/20`} />
      </div>
      <div className="space-y-2 group">
        <label className={labelClass} htmlFor="guide-timeline">When are you thinking of buying?</label>
        <select id="guide-timeline" name="timeline" required defaultValue="" className={`${fieldClass} appearance-none`}>
          <option value="" disabled className="bg-bg-secondary text-white">Select…</option>
          {TIMELINES.map((t) => (
            <option key={t} value={t} className="bg-bg-secondary text-white">{t}</option>
          ))}
        </select>
      </div>

      {state.error && <p className="text-red-400 text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="block text-center w-full py-6 bg-medsol-blue text-white text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-medsol-gold transition-all duration-700 disabled:opacity-50"
      >
        {isPending ? "Preparing…" : "Download the free guide"}
      </button>
      <p className="text-text-secondary text-xs font-light text-center">
        We&apos;ll only use your details to send you the guide and answer your questions. See our{" "}
        <a href="/privacy-policy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
