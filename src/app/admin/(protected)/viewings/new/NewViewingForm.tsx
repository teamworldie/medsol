"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

type FormActionState = { error?: string } | undefined;

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
    >
      {pending ? "Saving..." : "Schedule Viewing"}
    </button>
  );
}

export default function NewViewingForm({
  action,
  leads,
  properties,
  agents,
}: {
  action: (prevState: FormActionState, formData: FormData) => Promise<FormActionState>;
  leads: { id: string; name: string }[];
  properties: { id: string; title: string }[];
  agents: { id: string; name: string | null; email: string }[];
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Lead</label>
          <select
            name="leadId"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="">Select lead</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Property</label>
          <select
            name="propertyId"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="">Select property</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date &amp; Time</label>
          <input
            type="datetime-local"
            name="scheduledAt"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Agent (optional)</label>
          <select
            name="agentId"
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="">Unassigned</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name || a.email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <SaveButton />
        <Link href="/admin/viewings" className="text-sm text-gray-500 hover:text-gray-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
