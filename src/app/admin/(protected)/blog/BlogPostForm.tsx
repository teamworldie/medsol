"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useState } from "react";
import { BLOG_CATEGORIES, calculateReadTime } from "@/lib/readTime";

function FeaturedImageField({ initialUrl }: { initialUrl?: string | null }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setUrl(data.url);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Featured Image</label>
      <input type="hidden" name="featuredImage" value={url} />
      <div className="mt-1 flex items-start gap-4">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Featured" className="h-20 w-20 rounded-md object-cover border border-gray-200" />
        )}
        <div>
          <label
            className={`inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 ${
              uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            {uploading ? "Uploading..." : url ? "Replace Image" : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export default function BlogPostForm({
  action,
  submitLabel,
  initial,
}: {
  action: (prevState: any, formData: FormData) => Promise<any>;
  submitLabel: string;
  initial?: {
    title?: string;
    excerpt?: string | null;
    content?: string;
    category?: string | null;
    readTime?: string | null;
    featuredImage?: string | null;
    publishedAt?: Date | null;
  };
}) {
  const [state, formAction] = useFormState(action, undefined);
  const [readTime, setReadTime] = useState(() => calculateReadTime(initial?.content ?? ""));

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          name="title"
          required
          defaultValue={initial?.title}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Excerpt</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={initial?.excerpt ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <p className="mt-1 text-xs text-gray-400">
          Plain text only (no HTML tags will be rendered). Separate paragraphs with a blank line.
          Start a line with &quot;## &quot; for a subheading, or &quot;### &quot; for a smaller subheading.
        </p>
        <textarea
          name="content"
          required
          rows={12}
          defaultValue={initial?.content}
          onChange={(e) => setReadTime(calculateReadTime(e.target.value))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none font-mono"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            defaultValue={initial?.category ?? ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
          >
            <option value="">Select a category</option>
            {BLOG_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Read Time</label>
          <p className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
            {readTime} <span className="text-xs text-gray-400">(calculated automatically)</span>
          </p>
        </div>
      </div>

      <FeaturedImageField initialUrl={initial?.featuredImage} />

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={Boolean(initial?.publishedAt)}
          className="h-4 w-4"
        />
        Published (unchecked saves as a draft)
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <SaveButton label={submitLabel} />
        <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-900">
          Cancel
        </Link>
      </div>
    </form>
  );
}
