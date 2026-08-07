import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BlogPostRowActions from "./BlogPostRowActions";
import Pagination from "../Pagination";
import { SPAIN_TZ } from "@/lib/timezone";

const PAGE_SIZE = 20;

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  let posts: BlogPostRow[] = [];
  let total = 0;

  try {
    const [rows, count] = await Promise.all([
      prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.blogPost.count(),
    ]);
    posts = rows;
    total = count;
  } catch {
    console.error("Prisma failed to load on Vercel preview. Using mock data.");
    // eslint-disable-next-line react-hooks/purity -- fallback-data path in a Server Component, not client render code
    const now = Date.now();
    posts = [
      { id: "1", title: "5 Tips for Writing a Great Property Listing", slug: "writing-a-great-listing", category: "Market Insights", publishedAt: new Date(now), createdAt: new Date(now) },
      { id: "2", title: "A Buyer's Guide to Puerto Banús", slug: "buyers-guide-puerto-banus", category: "Guides", publishedAt: null, createdAt: new Date(now - 86400000) },
    ];
    total = posts.length;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Manage articles published to the public site.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Add Post
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
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
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                    No blog posts found.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{post.title}</span>
                        <span className="text-xs text-gray-400">/{post.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.category ?? "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.createdAt.toLocaleDateString("en-GB", { timeZone: SPAIN_TZ })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const isScheduled = post.publishedAt && post.publishedAt.getTime() > Date.now();
                        const label = isScheduled ? "Scheduled" : post.publishedAt ? "Published" : "Draft";
                        const colorClass = isScheduled
                          ? "bg-amber-100 text-amber-800"
                          : post.publishedAt
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800";
                        return (
                          <div className="flex flex-col gap-0.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${colorClass}`}>
                              {label}
                            </span>
                            {isScheduled && post.publishedAt && (
                              <span className="text-[11px] text-gray-400">
                                {post.publishedAt.toLocaleString("en-GB", {
                                  timeZone: SPAIN_TZ,
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <BlogPostRowActions id={post.id} />
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
          buildHref={(p) => (p > 1 ? `/admin/blog?page=${p}` : "/admin/blog")}
        />
      </div>
    </div>
  );
}
