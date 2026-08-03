import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import MediaUploader from "./MediaUploader";
import MediaCard from "./MediaCard";
import MediaFilters from "./MediaFilters";
import Pagination from "../Pagination";

const PAGE_SIZE = 48;

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; type?: string }>;
}) {
  const { page: pageParam, q, type } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  let media: { id: string; url: string; filename: string; mimeType: string | null; size: number | null; createdAt: Date }[] = [];
  let total = 0;
  let types: string[] = [];

  const where: Prisma.MediaWhereInput = {
    ...(q ? { filename: { contains: q, mode: "insensitive" } } : {}),
    ...(type ? { mimeType: type } : {}),
  };

  try {
    const [rows, count, typeGroups] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.media.count({ where }),
      prisma.media.findMany({
        where: { mimeType: { not: null } },
        distinct: ["mimeType"],
        select: { mimeType: true },
      }),
    ]);
    media = rows;
    total = count;
    types = typeGroups.map((t) => t.mimeType).filter((t): t is string => Boolean(t)).sort();
  } catch (e) {
    console.error("Prisma failed to load media:", e);
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(q || type);

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/admin/media?${qs}` : "/admin/media";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media</h1>
          <p className="text-gray-500 mt-1">Browse and manage uploaded images.</p>
        </div>
        <MediaUploader />
      </div>

      <MediaFilters types={types} activeQuery={q ?? ""} activeType={type ?? ""} total={total} />

      {media.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 text-center text-sm text-gray-500">
          {hasFilters ? "No media matches your search." : "No media uploaded yet."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {media.map((m) => (
              <MediaCard
                key={m.id}
                media={{
                  id: m.id,
                  url: m.url,
                  filename: m.filename,
                  mimeType: m.mimeType,
                  size: m.size,
                  createdAt: new Date(m.createdAt).toISOString(),
                }}
              />
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
          </div>
        </>
      )}
    </div>
  );
}
