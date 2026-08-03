"use client";

import { useRouter } from "next/navigation";

export default function SegmentFilter({
  tags,
  activeTag,
}: {
  tags: { id: string; name: string }[];
  activeTag: string | null;
}) {
  const router = useRouter();

  return (
    <select
      value={activeTag ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        router.push(value ? `/admin/leads?tag=${encodeURIComponent(value)}` : "/admin/leads");
      }}
      className="rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
    >
      <option value="">All Leads</option>
      {tags.map((tag) => (
        <option key={tag.id} value={tag.name}>
          {tag.name}
        </option>
      ))}
    </select>
  );
}
