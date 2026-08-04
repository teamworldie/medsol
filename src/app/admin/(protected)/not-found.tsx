import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-lg font-semibold text-gray-900">Not found</h2>
      <p className="mt-2 text-sm text-gray-500">The page or record you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/admin"
        className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
