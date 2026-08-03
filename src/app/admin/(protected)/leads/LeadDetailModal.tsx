"use client";

import { useState } from "react";

type LeadDetail = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  preferredContact: string | null;
  budget: string | null;
  area: string | null;
  propertyType: string | null;
  bedrooms: string | null;
  timeline: string | null;
  source: string | null;
  inquiryType: string | null;
  propertyId: string | null;
  status: string;
  leadScore: number | null;
  notes: string | null;
  aiSummary: string | null;
  createdAt: string;
};

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

export default function LeadDetailModal({ lead }: { lead: LeadDetail }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        View
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-lg bg-white shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="font-semibold text-gray-900">{lead.name}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 px-6 py-5">
              <Field label="Email" value={lead.email} />
              <Field label="Phone" value={lead.phone} />
              <Field label="Preferred Contact" value={lead.preferredContact} />
              <Field label="Inquiry Type" value={lead.inquiryType} />
              <Field label="Source" value={lead.source?.replace(/_/g, " ")} />
              <Field label="Status" value={lead.status} />
              <Field label="Lead Score" value={lead.leadScore} />
              <Field label="Budget" value={lead.budget} />
              <Field label="Area / Location" value={lead.area} />
              <Field label="Property Type" value={lead.propertyType} />
              <Field label="Bedrooms" value={lead.bedrooms} />
              <Field label="Timeline" value={lead.timeline} />
              <Field label="Related Property ID" value={lead.propertyId} />
              <div className="col-span-2">
                <Field label="Submitted" value={new Date(lead.createdAt).toLocaleString()} />
              </div>
              {lead.notes && (
                <div className="col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                    Notes / Message
                  </p>
                  <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap">{lead.notes}</p>
                </div>
              )}
              {lead.aiSummary && (
                <div className="col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">AI Summary</p>
                  <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap">{lead.aiSummary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
