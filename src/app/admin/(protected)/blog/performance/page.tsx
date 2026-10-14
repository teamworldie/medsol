import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getBlogPostTraffic, type BlogPostTraffic } from "@/lib/googleAnalytics";

const RANGES = [7, 30, 90] as const;

function formatDuration(seconds: number) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function StatCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default async function BlogPerformancePage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const { days: daysParam } = await searchParams;
  const days = RANGES.includes(Number(daysParam) as (typeof RANGES)[number]) ? Number(daysParam) : 30;

  let traffic: BlogPostTraffic[] | null = null;
  try {
    traffic = await getBlogPostTraffic(days);
  } catch (e) {
    console.error("Failed to fetch GA4 blog post traffic:", e);
  }

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [posts, leads] = await Promise.all([
    prisma.blogPost.findMany({
      where: { publishedAt: { not: null, lte: new Date() } },
      select: { slug: true, title: true, category: true, publishedAt: true },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: since }, notes: { contains: "Source page: /journal/" } },
      select: { notes: true },
    }),
  ]);

  // Enquiries credited to each post, read back from the "Source page:" line
  // the contact and guide forms append (see submitLead).
  const enquiriesBySlug = new Map<string, number>();
  for (const lead of leads) {
    const match = lead.notes?.match(/Source page: \/journal\/([A-Za-z0-9\-_]+)/);
    if (match) enquiriesBySlug.set(match[1], (enquiriesBySlug.get(match[1]) ?? 0) + 1);
  }

  const trafficBySlug = new Map((traffic ?? []).map((t) => [t.path.replace(/^\/journal\//, ""), t]));

  const rows = posts
    .map((post) => {
      const t = trafficBySlug.get(post.slug);
      return {
        ...post,
        views: t?.views ?? 0,
        users: t?.users ?? 0,
        avgSeconds: t?.avgEngagementSeconds ?? 0,
        organic: t?.organicSessions ?? 0,
        enquiries: enquiriesBySlug.get(post.slug) ?? 0,
      };
    })
    .sort((a, b) => b.views - a.views || b.enquiries - a.enquiries);

  const totalViews = rows.reduce((n, r) => n + r.views, 0);
  const totalOrganic = rows.reduce((n, r) => n + r.organic, 0);
  const totalEnquiries = rows.reduce((n, r) => n + r.enquiries, 0);
  const withViews = rows.filter((r) => r.views > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Performance</h1>
          <p className="text-gray-500 mt-1">Traffic, search visits and enquiries for every published article.</p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin/blog/performance?days=${r}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium border ${
                r === days ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {r} days
            </Link>
          ))}
          <Link href="/admin/blog" className="ml-2 text-sm text-gray-500 hover:text-gray-900">
            ← All posts
          </Link>
        </div>
      </div>

      {traffic === null && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Google Analytics isn&apos;t connected, or didn&apos;t respond, so views are showing as 0. Enquiry counts below still work.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Article views" value={totalViews.toLocaleString()} hint={`last ${days} days`} />
        <StatCard title="From Google search" value={totalOrganic.toLocaleString()} hint="organic sessions" />
        <StatCard title="Enquiries from articles" value={totalEnquiries} hint="contact + guide forms" />
        <StatCard title="Articles with traffic" value={`${withViews} / ${rows.length}`} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Article", "Views", "Visitors", "Avg. read time", "From Google", "Enquiries", "Enquiry rate"].map((h, i) => (
                  <th key={h} scope="col" className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${i === 0 ? "text-left" : "text-right"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">No published articles yet.</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.slug} className="hover:bg-gray-50">
                    <td className="px-4 py-3 max-w-md">
                      <a href={`/journal/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 hover:underline">
                        {r.title}
                      </a>
                      <p className="text-xs text-gray-400">
                        {r.category ?? "—"} · {r.publishedAt?.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">{r.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">{r.users.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">{formatDuration(r.avgSeconds)}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">{r.organic.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">{r.enquiries}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-600">
                      {r.users > 0 ? `${((r.enquiries / r.users) * 100).toFixed(1)}%` : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Views come from Google Analytics, which only records visitors who accept the cookie banner, so real traffic is higher than shown.
        Enquiries are counted from the form on the article, or from a guide download started on that article. Enquiries made before
        today&apos;s update aren&apos;t attributed.
      </p>
    </div>
  );
}
