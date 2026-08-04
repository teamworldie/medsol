import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublishedPostBySlug } from "@/lib/journal";
import { parseBlogContent } from "@/lib/blogContent";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blocks = parseBlogContent(post.content);
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <main className="bg-bg-primary pt-32 relative overflow-x-hidden">
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />

      <article className="py-24 relative z-10">
        <div className="max-content max-w-3xl mx-auto">
          <Link href="/journal" className="text-medsol-gold text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>

          <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-medsol-gold mb-6">
            {post.category && <span>{post.category}</span>}
            {post.category && (post.readTime || publishedDate) && <span className="text-white/20">|</span>}
            {post.readTime && <span>{post.readTime}</span>}
            {post.readTime && publishedDate && <span className="text-white/20">|</span>}
            {publishedDate && <span>{publishedDate}</span>}
          </div>

          <h1 className="text-4xl md:text-6xl font-serif leading-tight text-white mb-12">{post.title}</h1>

          {post.featuredImage && (
            <div className="aspect-video overflow-hidden mb-16 border border-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-8">
            {blocks.map((block, idx) =>
              block.type === "heading" ? (
                block.level === 2 ? (
                  <h2 key={idx} className="text-3xl font-serif text-white pt-4">{block.text}</h2>
                ) : (
                  <h3 key={idx} className="text-2xl font-serif text-white pt-2">{block.text}</h3>
                )
              ) : (
                <p key={idx} className="text-text-secondary leading-loose text-lg font-light">{block.text}</p>
              )
            )}
          </div>
        </div>
      </article>

      <Footer tagline="MEDSOL · Journal." />
    </main>
  );
}
