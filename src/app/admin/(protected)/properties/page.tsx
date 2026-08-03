import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import PropertiesTable from "./PropertiesTable";

const PAGE_SIZE = 20;
const PROPERTY_STATUSES = ["AVAILABLE", "RESERVED", "SOLD"];

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string; type?: string }>;
}) {
  const { page: pageParam, q, status, type } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let properties: any[] = [];
  let total = 0;
  let statuses: string[] = [];
  let types: string[] = [];

  const where: Prisma.PropertyWhereInput = {
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { community: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
  };

  try {
    const [rows, count, typeGroups] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.property.count({ where }),
      prisma.property.findMany({
        where: { type: { not: null } },
        distinct: ["type"],
        select: { type: true },
      }),
    ]);
    properties = rows;
    total = count;
    statuses = PROPERTY_STATUSES;
    types = typeGroups.map((t) => t.type).filter((t): t is string => Boolean(t));
  } catch {
    console.error("Prisma failed to load on Vercel preview. Using mock data.");
    // eslint-disable-next-line react-hooks/purity -- fallback-data path in a Server Component, not client render code
    const now = Date.now();
    properties = [
      { id: "1", title: "Sample Property A", price: "€1,250,000", status: "AVAILABLE", bedrooms: "4", bathrooms: "3", type: "Villa", community: "Sample District", isFeatured: true, createdAt: new Date(now) },
      { id: "2", title: "Marina Penthouse", price: "€890,000", status: "RESERVED", bedrooms: "3", bathrooms: "2", type: "Penthouse", community: "Puerto Banús", isFeatured: false, createdAt: new Date(now - 86400000) },
      { id: "3", title: "Golf Valley Townhouse", price: "€645,000", status: "SOLD", bedrooms: "3", bathrooms: "3", type: "Townhouse", community: "La Quinta", isFeatured: false, createdAt: new Date(now - 172800000) },
    ];
    total = properties.length;
    statuses = ["AVAILABLE", "RESERVED", "SOLD"];
    types = ["Villa", "Penthouse", "Townhouse"];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 mt-1">Manage your listings and prepare for MLS integration.</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Add Property
        </Link>
      </div>

      <PropertiesTable
        properties={properties.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          status: p.status,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          type: p.type,
          community: p.community,
          isFeatured: p.isFeatured,
        }))}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        statuses={statuses}
        types={types}
        activeQuery={q ?? ""}
        activeStatus={status ?? ""}
        activeType={type ?? ""}
      />
    </div>
  );
}
