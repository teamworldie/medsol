"use client";

import { useState, useTransition } from "react";
import { deleteAgent } from "@/app/actions/users";

export default function AgentRowActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!confirm("Delete this agent?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteAgent(id);
      if (!result.success) setError(result.error ?? "Failed to delete.");
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        Delete
      </button>
      {error && <p className="text-xs text-red-500 max-w-[200px] text-right">{error}</p>}
    </div>
  );
}
