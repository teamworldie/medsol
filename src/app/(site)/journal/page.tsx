import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/journal";
import { getPlaceholderImage } from "@/lib/blogPlaceholderImage";
import Footer from "@/components/site/Footer";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description: "Insights, guides, and stories from Medsol Real Estate — Mediterranean living, market updates, and life in Murcia.",
  alternates: { canonical: `${SITE_URL}/journal` },
  openGraph: { url: `${SITE_URL}/journal` },
};

export default async function JournalPage() {
  const posts = await getPublishedPosts();
  const cardImages = await Promise.all(
    posts.map(async (post) => post.featuredImage || (await getPlaceholderImage(post.id)))
  );

  return (
    <main className="bg-[#FAF7F2] pt-32 relative overflow-x-hidden">
      <section className="py-24 relative z-10">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-24">
            <span className="text-medsol-blue text-[11px] tracking-[0.5em] uppercase block">The Medsol Journal</span>
            <h1 className="text-5xl md:text-8xl font-serif leading-none italic text-gray-900">
              Stories &amp; <br /> <span className="not-italic text-medsol-blue">Insights.</span>
            </h1>
            <p className="text-gray-600 leading-loose font-light max-w-2xl text-lg mx-auto">
              Guides, market perspectives, and reflections on Mediterranean living from the Medsol team.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-gray-500 font-light py-24">
              No journal entries published yet — check back soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post, i) => (
                <Link href={`/journal/${post.slug}`} key={post.id} className="group cursor-pointer block space-y-6">
                  <div className="aspect-video overflow-hidden relative bg-gray-100 border border-gray-200">
                    {cardImages[i] && (
                      <Image
                        src={cardImages[i]}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-medsol-blue">
                      {post.category && <span>{post.category}</span>}
                      {post.category && post.readTime && <span className="text-gray-300">|</span>}
                      {post.readTime && <span>{post.readTime}</span>}
                    </div>
                    <h2 className="text-2xl font-serif text-gray-900 group-hover:text-medsol-gold transition-colors">{post.title}</h2>
                    {post.excerpt && <p className="text-gray-600 text-sm font-light leading-relaxed">{post.excerpt}</p>}
                    <p className="text-gray-400 text-xs font-light">By {post.author || "Lee Doherty"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer tagline="MEDSOL · Journal." />
    </main>
  );
}
