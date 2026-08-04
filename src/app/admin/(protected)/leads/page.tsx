import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LeadRowActions from "./LeadRowActions";
import LeadDetailModal from "./LeadDetailModal";
import LeadTags from "./LeadTags";
import SegmentFilter from "./SegmentFilter";
import Pagination from "../Pagination";

const PAGE_SIZE = 20;

type LeadRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  preferredContact: string | null;
  budget: string | null;
  area: string | null;
  propertyType: string | null;
  bedrooms: string | null;
  timeline: string | null;
  source: string | null;
  inquiryType: string | null;
  propertyId: string | null;
  status: string;
  leadScore: number | null;
  notes: string | null;
  aiSummary: string | null;
  lastContactedAt: Date | null;
  createdAt: Date;
  tags: { id: string; name: string; color: string }[];
  leadNotes: { id: string; content: string; createdAt: Date }[];
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { tag, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  let leads: LeadRow[] = [];
  let allTags: { id: string; name: string; color: string }[] = [];
  let total = 0;

  const where = tag ? { tags: { some: { name: tag } } } : undefined;

  try {
    let count: number;
    [leads, count, allTags] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { tags: true, leadNotes: { orderBy: { createdAt: "desc" } } },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.lead.count({ where }),
      prisma.tag.findMany({ orderBy: { name: "asc" } }),
    ]);
    total = count;
  } catch {
    console.error("Prisma failed to load on Vercel preview. Using mock data.");
    // eslint-disable-next-line react-hooks/purity -- fallback-data path in a Server Component, not client render code
    const now = Date.now();
    const emptyLeadDetails = {
      preferredContact: null,
      budget: null,
      area: null,
      propertyType: null,
      bedrooms: null,
      timeline: null,
      inquiryType: null,
      propertyId: null,
      leadScore: null,
      notes: null,
      aiSummary: null,
      lastContactedAt: null,
      leadNotes: [],
    };
    leads = [
      { id: "1", name: "Alice Johnson", email: "alice@example.com", phone: "+420 123 456 789", source: "CONTACT_FORM", status: "NEW", createdAt: new Date(now), tags: [], ...emptyLeadDetails },
      { id: "2", name: "Bob Smith", email: "bob@example.com", phone: "+44 7700 900077", source: "PROPERTY_INQUIRY", status: "CONTACTED", createdAt: new Date(now - 86400000), tags: [], ...emptyLeadDetails, propertyId: "sample-a" },
      { id: "3", name: "Charlie Davis", email: "charlie@example.com", phone: "+1 555 123 4567", source: "NEWSLETTER", status: "QUALIFIED", createdAt: new Date(now - 172800000), tags: [], ...emptyLeadDetails },
    ];
    total = leads.length;
  }

  const allTagNames = allTags.map((t) => t.name);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">Manage all your incoming inquiries and contacts.</p>
        </div>
        <div className="flex items-center gap-4">
          <SegmentFilter tags={allTags} activeTag={tag ?? null} />
          <Link
            href="/admin/leads/new"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            Add Lead
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    {tag ? `No leads tagged "${tag}".` : "No leads found."}
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                        <span className="text-sm text-gray-500">{lead.email}</span>
                        {lead.phone && <span className="text-xs text-gray-400 mt-0.5">{lead.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lead.source?.replace('_', ' ') ?? '—'}
                      </div>
                      {lead.inquiryType && (
                        <div className="text-xs text-gray-500 mt-0.5">{lead.inquiryType}</div>
                      )}
                      {lead.propertyId && (
                        <div className="text-xs text-blue-600 mt-0.5">Property ID: {lead.propertyId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <LeadTags leadId={lead.id} tags={lead.tags ?? []} allTagNames={allTagNames} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-800' :
                        lead.status === 'ARCHIVED' ? 'bg-gray-100 text-gray-500' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <LeadDetailModal
                          lead={{
                            id: lead.id,
                            name: lead.name,
                            email: lead.email,
                            phone: lead.phone,
                            preferredContact: lead.preferredContact,
                            budget: lead.budget,
                            area: lead.area,
                            propertyType: lead.propertyType,
                            bedrooms: lead.bedrooms,
                            timeline: lead.timeline,
                            source: lead.source,
                            inquiryType: lead.inquiryType,
                            propertyId: lead.propertyId,
                            status: lead.status,
                            leadScore: lead.leadScore,
                            notes: lead.notes,
                            aiSummary: lead.aiSummary,
                            lastContactedAt: lead.lastContactedAt ? new Date(lead.lastContactedAt).toISOString() : null,
                            createdAt: new Date(lead.createdAt).toISOString(),
                          }}
                          leadNotes={lead.leadNotes.map((n) => ({
                            id: n.id,
                            content: n.content,
                            createdAt: new Date(n.createdAt).toISOString(),
                          }))}
                        />
                        <LeadRowActions
                          leadId={lead.id}
                          status={lead.status}
                          phone={lead.phone}
                          email={lead.email}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          buildHref={(p) => {
            const params = new URLSearchParams();
            if (tag) params.set("tag", tag);
            if (p > 1) params.set("page", String(p));
            const qs = params.toString();
            return qs ? `/admin/leads?${qs}` : "/admin/leads";
          }}
        />
      </div>
    </div>
  );
}
