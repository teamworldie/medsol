"use client";

import { useRouter } from "next/navigation";

export default function InquiryTypeFilter({
  options,
  active,
}: {
  options: string[];
  active: string | null;
}) {
  const router = useRouter();

  return (
    <select
      value={active ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        router.push(value ? `/admin/analytics?inquiryType=${encodeURIComponent(value)}` : "/admin/analytics");
      }}
      className="rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
    >
      <option value="">All Inquiry Types</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
