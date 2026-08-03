"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/app/actions/leads";
import { LEAD_STATUSES } from "@/lib/leadStatuses";

function toWhatsAppLink(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${digits}`;
}

export default function LeadRowActions({
  leadId,
  status,
  phone,
  email,
}: {
  leadId: string;
  status: string;
  phone?: string | null;
  email?: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(() => {
      updateLeadStatus(leadId, newStatus);
    });
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <select
        defaultValue={status}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="rounded-md border border-gray-200 bg-white pl-2 pr-6 py-1 text-xs font-medium text-gray-700 disabled:opacity-50"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {email && (
        <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-900" title="Email">
          Email
        </a>
      )}
      {phone && (
        <>
          <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-900" title="Call">
            Call
          </a>
          <a
            href={toWhatsAppLink(phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800"
            title="WhatsApp"
          >
            WhatsApp
          </a>
        </>
      )}
      {status !== "ARCHIVED" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleStatusChange("ARCHIVED")}
          className="text-gray-400 hover:text-gray-700 disabled:opacity-50"
          title="Archive"
        >
          Archive
        </button>
      )}
    </div>
  );
}
