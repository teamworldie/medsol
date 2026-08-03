"use client";

import { useState, useTransition } from "react";
import { deleteMedia, renameMedia } from "@/app/actions/media";

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string | null;
  size: number | null;
  createdAt: string;
};

export default function MediaCard({ media }: { media: MediaItem }) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(media.filename);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(media.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDelete = () => {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    startTransition(() => {
      deleteMedia(media.id);
    });
  };

  const handleRename = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === media.filename) {
      setRenaming(false);
      setName(media.filename);
      return;
    }
    startTransition(() => {
      renameMedia(media.id, trimmed);
    });
    setRenaming(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setPreview(true)}
          className="block w-full aspect-square bg-gray-100 group relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.url} alt={media.filename} className="w-full h-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
            <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium transition-opacity">
              View
            </span>
          </span>
        </button>

        <div className="p-2 space-y-1">
          {renaming ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleRename();
                }
                if (e.key === "Escape") {
                  setName(media.filename);
                  setRenaming(false);
                }
              }}
              className="w-full rounded border border-gray-300 px-1 py-0.5 text-[11px] focus:border-gray-900 focus:outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setRenaming(true)}
              className="block w-full truncate text-left text-[11px] font-medium text-gray-900 hover:underline"
              title={`${media.filename} (click to rename)`}
            >
              {media.filename}
            </button>
          )}
          <p className="text-[10px] text-gray-400">
            {media.size ? `${Math.round(media.size / 1024)} KB` : ""}
          </p>
          <div className="flex items-center gap-2 text-[10px] font-medium">
            <button type="button" onClick={handleCopy} className="text-blue-600 hover:text-blue-900">
              {copied ? "Copied!" : "Copy"}
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
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreview(false)}
        >
          <button
            type="button"
            onClick={() => setPreview(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.url}
            alt={media.filename}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-md"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 text-white/80 text-sm">{media.filename}</p>
        </div>
      )}
    </>
  );
}
