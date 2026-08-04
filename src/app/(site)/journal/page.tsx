import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/journal";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description: "Insights, guides, and stories from Medsol Real Estate — Mediterranean living, market updates, and life in Murcia.",
};

export default async function JournalPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="bg-bg-primary pt-32 relative overflow-x-hidden">
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />

      <section className="py-24 relative z-10">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-24">
            <span className="text-medsol-gold text-[11px] tracking-[0.5em] uppercase block">The Medsol Journal</span>
            <h1 className="text-5xl md:text-8xl font-serif leading-none italic text-shadow-luxury">
              Stories &amp; <br /> <span className="not-italic text-medsol-blue">Insights.</span>
            </h1>
            <p className="text-text-secondary leading-loose font-light max-w-2xl text-lg mx-auto">
              Guides, market perspectives, and reflections on Mediterranean living from the Medsol team.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-text-secondary font-light py-24">
              No journal entries published yet — check back soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post) => (
                <Link href={`/journal/${post.slug}`} key={post.id} className="group cursor-pointer block space-y-6">
                  <div className="aspect-video overflow-hidden relative bg-bg-secondary">
                    {post.featuredImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-medsol-blue/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-medsol-gold">
                      {post.category && <span>{post.category}</span>}
                      {post.category && post.readTime && <span className="text-white/20">|</span>}
                      {post.readTime && <span>{post.readTime}</span>}
                    </div>
                    <h2 className="text-2xl font-serif text-white group-hover:text-medsol-gold transition-colors">{post.title}</h2>
                    {post.excerpt && <p className="text-text-secondary text-sm font-light leading-relaxed">{post.excerpt}</p>}
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
