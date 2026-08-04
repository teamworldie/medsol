import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ViewingRowActions from "./ViewingRowActions";
import ViewingsViewToggle from "./ViewingsViewToggle";

type ViewingRow = {
  id: string;
  scheduledAt: Date;
  status: string;
  lead: { name: string } | null;
  property: { title: string } | null;
  agent: { name: string | null } | null;
};

export default async function ViewingsPage() {
  let viewings: ViewingRow[] = [];

  try {
    // No pagination here: the calendar view needs the full set of viewings to
    // plot across dates, so we cap with `take` instead as a safety net against
    // unbounded growth (same pattern used for Messages).
    viewings = await prisma.viewing.findMany({
      orderBy: { scheduledAt: "asc" },
      include: { lead: true, property: true, agent: true },
      take: 300,
    });
  } catch {
    console.error("Prisma failed to load on Vercel preview. Using mock data.");
    // eslint-disable-next-line react-hooks/purity -- fallback-data path in a Server Component, not client render code
    const now = Date.now();
    viewings = [
      { id: "1", scheduledAt: new Date(now + 86400000), status: "SCHEDULED", lead: { name: "Alice Johnson" }, property: { title: "Sample Property A" }, agent: { name: "Agent Name" } },
      { id: "2", scheduledAt: new Date(now - 86400000), status: "COMPLETED", lead: { name: "Bob Smith" }, property: { title: "Sample Property B" }, agent: { name: "Admin" } },
      { id: "3", scheduledAt: new Date(now + 172800000), status: "SCHEDULED", lead: { name: "Charlie Davis" }, property: { title: "Golf Valley Townhouse" }, agent: null },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Viewings</h1>
          <p className="text-gray-500 mt-1">Track scheduled, completed, and cancelled property viewings.</p>
        </div>
        <Link
          href="/admin/viewings/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Schedule Viewing
        </Link>
      </div>

      <ViewingsViewToggle
        viewings={viewings.map((v) => ({
          id: v.id,
          scheduledAt: new Date(v.scheduledAt).toISOString(),
          status: v.status,
          leadName: v.lead?.name ?? "Unknown",
          propertyTitle: v.property?.title ?? "Unknown",
        }))}
        table={
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date &amp; Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
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
                  {viewings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                        No viewings found.
                      </td>
                    </tr>
                  ) : (
                    viewings.map((viewing) => (
                      <tr key={viewing.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {viewing.scheduledAt.toLocaleDateString()} {viewing.scheduledAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {viewing.lead?.name ?? "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {viewing.property?.title ?? "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {viewing.agent?.name ?? "Unassigned"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            viewing.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            viewing.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            viewing.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {viewing.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <ViewingRowActions id={viewing.id} status={viewing.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        }
      />
    </div>
  );
}
