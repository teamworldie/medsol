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
      {pending ? "Saving..." : "Create Task"}
    </button>
  );
}

export default function NewTaskForm({
  action,
  agents,
  leads,
}: {
  action: (prevState: FormActionState, formData: FormData) => Promise<FormActionState>;
  agents: { id: string; name: string | null; email: string }[];
  leads: { id: string; name: string }[];
}) {
  const [state, formAction] = useFormState(action, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Task</label>
        <input
          name="title"
          required
          placeholder="Follow up with client"
          className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Assigned To</label>
          <select
            name="agentId"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="">Select agent</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name || a.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Related Lead (optional)</label>
        <select
          name="leadId"
          className="mt-1 block w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        >
          <option value="">None</option>
          {leads.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <SaveButton />
        <Link href="/admin/tasks" className="text-sm text-gray-500 hover:text-gray-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
