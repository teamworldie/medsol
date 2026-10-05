"use client";

import { useActionState } from "react";
import { joinInsider, type InsiderState } from "@/app/actions/insider";

const initialState: InsiderState = { success: false };
const fieldClass =
  "w-full bg-transparent border-b border-white/10 py-2 focus:border-medsol-gold transition-all outline-none font-light text-white";
const labelClass = "text-[10px] tracking-[0.2em] uppercase text-text-secondary group-focus-within:text-medsol-gold transition-colors";

export default function InsiderForm({ channel }: { channel: string }) {
  const [state, formAction, isPending] = useActionState(joinInsider, initialState);

  if (state.success) {
    return (
      <div className="text-center py-10 space-y-3">
        <p className="text-medsol-gold text-2xl font-serif">Thank you, we&apos;ll be in touch.</p>
        <p className="text-text-secondary font-light">Lee will keep you posted with news and useful guidance.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="channel" value={channel} />
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="space-y-2 group">
        <label className={labelClass} htmlFor="in-name">Full Name</label>
        <input id="in-name" type="text" name="fullName" required className={fieldClass} />
      </div>
      <div className="space-y-2 group">
        <label className={labelClass} htmlFor="in-email">Email Address</label>
        <input id="in-email" type="email" name="email" required className={fieldClass} />
      </div>
      {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="block text-center w-full py-6 bg-medsol-blue text-white text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-medsol-gold transition-all duration-700 disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Keep me posted"}
      </button>
      <p className="text-text-secondary text-xs font-light text-center">
        We&apos;ll only email you occasionally about Murcia property. Unsubscribe any time. See our{" "}
        <a href="/privacy-policy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
