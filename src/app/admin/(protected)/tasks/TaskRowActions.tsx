"use client";

import { useTransition } from "react";
import { toggleTaskStatus, deleteTask } from "@/app/actions/tasks";

export default function TaskRowActions({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      toggleTaskStatus(id, status);
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this task?")) return;
    startTransition(() => {
      deleteTask(id);
    });
  };

  return (
    <div className="flex items-center justify-end gap-3 text-sm font-medium">
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggle}
        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
      >
        {status === "PENDING" ? "Mark Complete" : "Reopen"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
