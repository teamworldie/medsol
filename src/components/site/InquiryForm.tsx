"use client";

import { useActionState } from "react";
import { submitLead, type LeadFormState } from "@/app/actions/publicLead";

const initialState: LeadFormState = { success: false };

const fieldClass =
  "w-full bg-transparent border-b border-white/10 py-2 focus:border-medsol-gold transition-all outline-none font-light text-white";
const labelClass = "text-[10px] tracking-[0.2em] uppercase text-text-secondary group-focus-within:text-medsol-gold transition-colors";

export default function InquiryForm({
  variant,
  propertyId,
  inquiryType,
  showCollectionSelect = false,
  buttonLabel = "Send Inquiry",
  buttonClassName = "block text-center w-full py-6 bg-medsol-blue text-white text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-medsol-gold transition-all duration-700 disabled:opacity-50",
}: {
  variant: "contact" | "villa";
  propertyId?: string;
  inquiryType?: string;
  showCollectionSelect?: boolean;
  buttonLabel?: string;
  buttonClassName?: string;
}) {
  const [state, formAction, isPending] = useActionState(submitLead, initialState);

  if (state.success) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-medsol-gold text-xl font-serif">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-10">
      {propertyId && <input type="hidden" name="propertyId" value={propertyId} />}
      {inquiryType && <input type="hidden" name="inquiryType" value={inquiryType} />}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {variant === "contact" ? (
        <>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-2 group">
              <label className={labelClass}>First Name</label>
              <input type="text" name="firstName" required className={fieldClass} />
            </div>
            <div className="space-y-2 group">
              <label className={labelClass}>Last Name</label>
              <input type="text" name="lastName" required className={fieldClass} />
            </div>
          </div>
          <div className="space-y-2 group">
            <label className={labelClass}>Email Address</label>
            <input type="email" name="email" required className={fieldClass} />
          </div>
          {showCollectionSelect && (
            <div className="space-y-2 group">
              <label className={labelClass}>Collection of Interest</label>
              <select name="inquiryType" defaultValue="General" className={`${fieldClass} appearance-none`}>
                <option value="Omala" className="bg-bg-secondary text-white">Omala Residences</option>
                <option value="Alhama" className="bg-bg-secondary text-white">Alhama Nature</option>
                <option value="Corvera" className="bg-bg-secondary text-white">Corvera Hills</option>
                <option value="General" className="bg-bg-secondary text-white">General Information</option>
              </select>
            </div>
          )}
          <div className="space-y-2 group">
            <label className={labelClass}>Message</label>
            <textarea name="message" required rows={4} className={`${fieldClass} resize-none`} />
          </div>
        </>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2 group">
              <label className={labelClass}>Full Name</label>
              <input type="text" name="fullName" required className={fieldClass} />
            </div>
            <div className="space-y-2 group">
              <label className={labelClass}>Email Address</label>
              <input type="email" name="email" required className={fieldClass} />
            </div>
          </div>
          <div className="space-y-2 group">
            <label className={labelClass}>Phone Number</label>
            <input type="tel" name="phone" className={fieldClass} />
          </div>
        </>
      )}

      {state.error && <p className="text-red-400 text-sm">{state.error}</p>}

      <button type="submit" disabled={isPending} className={buttonClassName}>
        {isPending ? "Sending..." : buttonLabel}
      </button>
    </form>
  );
}
