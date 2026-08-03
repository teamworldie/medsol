"use client";

import { useRef, useState, useTransition } from "react";
import { addTagToLead, removeTagFromLead } from "@/app/actions/tags";
import { TAG_COLORS } from "@/lib/tagColors";

const COLOR_CLASSES: Record<string, string> = {
  gray: "bg-gray-100 text-gray-700",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
  purple: "bg-purple-100 text-purple-800",
  pink: "bg-pink-100 text-pink-800",
};

export type LeadTag = { id: string; name: string; color: string };

export default function LeadTags({
  leadId,
  tags,
  allTagNames,
}: {
  leadId: string;
  tags: LeadTag[];
  allTagNames: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");
  const [color, setColor] = useState<string>("gray");
  const inputRef = useRef<HTMLInputElement>(null);
  const datalistId = `tag-options-${leadId}`;

  const handleAdd = () => {
    const name = value.trim();
    if (!name) return;
    startTransition(() => {
      addTagToLead(leadId, name, color);
    });
    setValue("");
    setAdding(false);
  };

  const handleRemove = (tagId: string) => {
    startTransition(() => {
      removeTagFromLead(leadId, tagId);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-1">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${COLOR_CLASSES[tag.color] ?? COLOR_CLASSES.gray}`}
        >
          {tag.name}
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleRemove(tag.id)}
            className="opacity-60 hover:opacity-100"
            aria-label={`Remove ${tag.name}`}
          >
            ×
          </button>
        </span>
      ))}

      {adding ? (
        <span className="inline-flex items-center gap-1">
          <input
            ref={inputRef}
            list={datalistId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="Tag name"
            autoFocus
            className="w-24 rounded border border-gray-300 px-1.5 py-0.5 text-[11px] focus:border-gray-900 focus:outline-none"
          />
          <datalist id={datalistId}>
            {allTagNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="rounded border border-gray-300 pl-1 pr-5 py-0.5 text-[11px] focus:border-gray-900 focus:outline-none"
            aria-label="Tag color"
          >
            {TAG_COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAdd}
            className="text-[11px] font-medium text-blue-600 hover:text-blue-900"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="text-[11px] text-gray-400 hover:text-gray-700"
          >
            Cancel
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="text-[11px] font-medium text-gray-400 hover:text-gray-700 border border-dashed border-gray-300 rounded-full px-2 py-0.5"
        >
          + Tag
        </button>
      )}
    </div>
  );
}
