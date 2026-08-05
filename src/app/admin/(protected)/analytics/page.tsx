import { prisma } from "@/lib/prisma";
import InquiryTypeFilter from "./InquiryTypeFilter";
import { getTrafficSummary, type TrafficSummary } from "@/lib/googleAnalytics";

const STATUS_ORDER = ["NEW", "CONTACTED", "QUALIFIED", "LOST", "ARCHIVED"];
const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-yellow-500",
  QUALIFIED: "bg-green-500",
  LOST: "bg-red-400",
  ARCHIVED: "bg-gray-400",
};

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function BarRow({ label, count, max, colorClass }: { label: string; count: number; max: number; colorClass: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500">{count}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ inquiryType?: string }>;
}) {
  const { inquiryType: activeInquiryType } = await searchParams;

  let traffic: TrafficSummary | null = null;
  try {
    traffic = await getTrafficSummary(30);
  } catch (e) {
    console.error("Failed to fetch GA4 traffic summary:", e);
  }

  let totalLeads = 0;
  let qualifiedLeads = 0;
  let totalProperties = 0;
  let leadsByStatus: { status: string; count: number }[] = [];
  let leadsBySource: { source: string | null; count: number }[] = [];
  let leadsByInquiryType: { inquiryType: string | null; count: number }[] = [];
  let leadsByDay: { day: string; count: number }[] = [];
  let inquiryTypeOptions: string[] = [];

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const inquiryTypeWhere = activeInquiryType ? { inquiryType: activeInquiryType } : {};

    const [total, qualified, properties, statusGroups, sourceGroups, inquiryTypeGroups, recentLeads, allInquiryTypes] =
      await Promise.all([
        prisma.lead.count({ where: inquiryTypeWhere }),
        prisma.lead.count({ where: { ...inquiryTypeWhere, status: "QUALIFIED" } }),
        prisma.property.count(),
        prisma.lead.groupBy({ by: ["status"], _count: { status: true }, where: inquiryTypeWhere }),
        prisma.lead.groupBy({ by: ["source"], _count: { source: true }, where: inquiryTypeWhere }),
        prisma.lead.groupBy({
          by: ["inquiryType"],
          _count: { inquiryType: true },
          where: activeInquiryType ? inquiryTypeWhere : { inquiryType: { not: null } },
        }),
        prisma.lead.findMany({
          where: { ...inquiryTypeWhere, createdAt: { gte: thirtyDaysAgo } },
          select: { createdAt: true },
        }),
        prisma.lead.findMany({
          where: { inquiryType: { not: null } },
          distinct: ["inquiryType"],
          select: { inquiryType: true },
        }),
      ]);

    totalLeads = total;
    qualifiedLeads = qualified;
    totalProperties = properties;
    leadsByStatus = statusGroups.map((g) => ({ status: g.status, count: g._count.status }));
    leadsBySource = sourceGroups
      .map((g) => ({ source: g.source, count: g._count.source }))
      .sort((a, b) => b.count - a.count);
    leadsByInquiryType = inquiryTypeGroups
      .map((g) => ({ inquiryType: g.inquiryType, count: g._count.inquiryType }))
      .sort((a, b) => b.count - a.count);
    inquiryTypeOptions = allInquiryTypes
      .map((g) => g.inquiryType)
      .filter((v): v is string => Boolean(v))
      .sort();

    const dayMap = new Map<string, number>();
    for (const lead of recentLeads) {
      const key = new Date(lead.createdAt).toISOString().slice(0, 10);
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
    }
    // Fill in every day of the window (including zero-count days) so the
    // chart always reads as a 30-day time series instead of a handful of
    // full-width bars when only one or two days have data.
    leadsByDay = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().slice(0, 10);
      return { day: key, count: dayMap.get(key) ?? 0 };
    });
  } catch (e) {
    console.error("Prisma failed to load analytics data:", e);
  }

  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
  const statusMax = Math.max(1, ...leadsByStatus.map((s) => s.count));
  const sourceMax = Math.max(1, ...leadsBySource.map((s) => s.count));
  const inquiryTypeMax = Math.max(1, ...leadsByInquiryType.map((s) => s.count));
  const dayMax = Math.max(1, ...leadsByDay.map((d) => d.count));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Lead pipeline and website traffic, in one place.</p>
        </div>
        <InquiryTypeFilter options={inquiryTypeOptions} active={activeInquiryType ?? null} />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Website Traffic (last 30 days)</h2>
        {traffic ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Visitors" value={traffic.users} />
              <StatCard title="Sessions" value={traffic.sessions} />
              <StatCard title="Page Views" value={traffic.pageViews} />
            </div>
            {traffic.topPages.length > 0 && (
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {traffic.topPages.map((page) => (
                    <BarRow
                      key={page.path}
                      label={page.path}
                      count={page.views}
                      max={Math.max(1, ...traffic!.topPages.map((p) => p.views))}
                      colorClass="bg-gray-900"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">
              Website traffic isn&apos;t connected yet. It needs a Google Analytics 4 service account
              (property ID + credentials) set as environment variables - ask your developer to set
              this up.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Lead Pipeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Leads" value={totalLeads} />
        <StatCard title="Qualified Leads" value={qualifiedLeads} />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} />
        <StatCard title="Active Properties" value={totalProperties} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Leads by Status</h3>
          {leadsByStatus.length === 0 ? (
            <p className="text-sm text-gray-500">No lead data yet.</p>
          ) : (
            <div className="space-y-3">
              {STATUS_ORDER.filter((s) => leadsByStatus.some((g) => g.status === s)).map((status) => {
                const group = leadsByStatus.find((g) => g.status === status)!;
                return (
                  <BarRow
                    key={status}
                    label={status}
                    count={group.count}
                    max={statusMax}
                    colorClass={STATUS_COLORS[status] ?? "bg-gray-400"}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Leads by Source</h3>
          {leadsBySource.length === 0 ? (
            <p className="text-sm text-gray-500">No lead data yet.</p>
          ) : (
            <div className="space-y-3">
              {leadsBySource.map((g) => (
                <BarRow
                  key={g.source ?? "unknown"}
                  label={(g.source ?? "Unknown").replace(/_/g, " ")}
                  count={g.count}
                  max={sourceMax}
                  colorClass="bg-gray-900"
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Leads by Inquiry Type</h3>
          {leadsByInquiryType.length === 0 ? (
            <p className="text-sm text-gray-500">No inquiry type data yet.</p>
          ) : (
            <div className="space-y-3">
              {leadsByInquiryType.map((g) => (
                <BarRow
                  key={g.inquiryType ?? "unknown"}
                  label={g.inquiryType ?? "Unknown"}
                  count={g.count}
                  max={inquiryTypeMax}
                  colorClass="bg-amber-600"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">New Leads (last 30 days)</h3>
        {totalLeads === 0 ? (
          <p className="text-sm text-gray-500">No leads in the last 30 days.</p>
        ) : (
          <>
            <div className="flex items-end gap-1 h-32">
              {leadsByDay.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <div
                    className={`w-full rounded-t-sm ${d.count > 0 ? "bg-gray-900" : "bg-gray-100"}`}
                    style={{ height: d.count > 0 ? `${Math.max(6, (d.count / dayMax) * 100)}%` : "2px" }}
                    title={`${new Date(d.day).toLocaleDateString(undefined, { month: "short", day: "numeric" })}: ${d.count} lead${d.count === 1 ? "" : "s"}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
              <span>{new Date(leadsByDay[0].day).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
              <span>{new Date(leadsByDay[leadsByDay.length - 1].day).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
