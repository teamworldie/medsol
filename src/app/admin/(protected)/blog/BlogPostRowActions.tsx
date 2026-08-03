"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteBlogPost } from "@/app/actions/blog";

export default function BlogPostRowActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    startTransition(() => {
      deleteBlogPost(id);
    });
  };

  return (
    <div className="flex items-center justify-end gap-3 text-sm font-medium">
      <Link href={`/admin/blog/${id}/edit`} className="text-blue-600 hover:text-blue-900">
        Edit
      </Link>
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
