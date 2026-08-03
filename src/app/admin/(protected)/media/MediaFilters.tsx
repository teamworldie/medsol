"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function MediaFilters({
  types,
  activeQuery,
  activeType,
  total,
}: {
  types: string[];
  activeQuery: string;
  activeType: string;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(activeQuery);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounce the search box so we don't push a URL update on every keystroke
  useEffect(() => {
    if (search === activeQuery) return;
    const timeout = setTimeout(() => updateParams({ q: search }), 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters = Boolean(activeQuery || activeType);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by filename..."
        className="w-full sm:max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
      />
      <select
        value={activeType}
        onChange={(e) => updateParams({ type: e.target.value })}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none"
      >
        <option value="">All Types</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t.replace("image/", "").toUpperCase()}
          </option>
        ))}
      </select>
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            router.push(pathname);
          }}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Clear filters
        </button>
      )}
      <span className="sm:ml-auto text-sm text-gray-400">
        {total} {total === 1 ? "file" : "files"}
      </span>
    </div>
  );
}
