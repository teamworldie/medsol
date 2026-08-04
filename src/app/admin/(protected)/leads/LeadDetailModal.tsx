"use client";

import { useState, useTransition } from "react";
import { addLeadNote, markLeadContacted } from "@/app/actions/leads";

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
  lastContactedAt: string | null;
  createdAt: string;
};

type LeadNoteItem = { id: string; content: string; createdAt: string };

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function NotesSection({ leadId, notes }: { leadId: string; notes: LeadNoteItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState("");
  const [localNotes, setLocalNotes] = useState(notes);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const content = draft.trim();
    if (!content) return;
    setError(null);
    startTransition(async () => {
      const result = await addLeadNote(leadId, content);
      if (result.success) {
        setLocalNotes((prev) => [{ id: `temp-${Date.now()}`, content, createdAt: new Date().toISOString() }, ...prev]);
        setDraft("");
      } else {
        setError(result.error ?? "Failed to save note.");
      }
    });
  };

  return (
    <div className="col-span-2 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">Notes</p>

      <div className="flex items-start gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Log a call, meeting, or update..."
          rows={2}
          className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none"
        />
        <button
          type="button"
          disabled={isPending || !draft.trim()}
          onClick={handleAdd}
          className="shrink-0 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}

      {localNotes.length > 0 && (
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {localNotes.map((note) => (
            <div key={note.id} className="border-l-2 border-gray-200 pl-3">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{note.content}</p>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(note.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LeadDetailModal({ lead, leadNotes }: { lead: LeadDetail; leadNotes: LeadNoteItem[] }) {
  const [open, setOpen] = useState(false);
  const [isMarking, startMarking] = useTransition();
  const [lastContactedAt, setLastContactedAt] = useState(lead.lastContactedAt);

  const handleMarkContacted = () => {
    startMarking(async () => {
      const result = await markLeadContacted(lead.id);
      if (result.success) setLastContactedAt(new Date().toISOString());
    });
  };

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
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isMarking}
                  onClick={handleMarkContacted}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {isMarking ? "Saving..." : "Mark Contacted"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-700"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
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
              <Field label="Submitted" value={new Date(lead.createdAt).toLocaleString()} />
              <Field label="Last Contacted" value={lastContactedAt ? new Date(lastContactedAt).toLocaleString() : "Never"} />
              {lead.notes && (
                <div className="col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
                    Original Message
                  </p>
                  <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap">{lead.notes}</p>
                </div>
              )}
              <NotesSection leadId={lead.id} notes={leadNotes} />
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
