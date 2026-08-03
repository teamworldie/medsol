"use client";

import { useTransition } from "react";
import { updateViewingStatus, deleteViewing } from "@/app/actions/viewings";
import { VIEWING_STATUSES } from "@/lib/viewingStatuses";

export default function ViewingRowActions({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(() => {
      updateViewingStatus(id, newStatus);
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this viewing?")) return;
    startTransition(() => {
      deleteViewing(id);
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
        {VIEWING_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
