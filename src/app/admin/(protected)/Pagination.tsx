import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className="text-sm font-medium text-gray-700 hover:text-gray-900">
          ← Previous
        </Link>
      ) : (
        <span className="text-sm font-medium text-gray-300 cursor-not-allowed">← Previous</span>
      )}
      <span className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className="text-sm font-medium text-gray-700 hover:text-gray-900">
          Next →
        </Link>
      ) : (
        <span className="text-sm font-medium text-gray-300 cursor-not-allowed">Next →</span>
      )}
    </div>
  );
}
