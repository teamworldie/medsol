import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublishedPostBySlug } from "@/lib/journal";
import { parseBlogContent, parseInlineSpans, type BlogContentBlock, type InlineSpan } from "@/lib/blogContent";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import Footer from "@/components/site/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || undefined;

  return {
    title,
    description,
    keywords: post.targetKeyword ? [post.targetKeyword] : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

function InlineText({ spans }: { spans: InlineSpan[] }) {
  return (
    <>
      {spans.map((span, i) => {
        if (span.type === "bold") return <strong key={i}>{span.text}</strong>;
        if (span.type === "link")
          return (
            <a key={i} href={span.href} className="text-medsol-gold underline hover:text-white transition-colors">
              {span.text}
            </a>
          );
        return <span key={i}>{span.text}</span>;
      })}
    </>
  );
}

// Plain-text rendering of a block's content, used for JSON-LD (no markup).
function plainText(text: string): string {
  return parseInlineSpans(text)
    .map((span) => span.text)
    .join("");
}

// Heuristic for the plan's answer-first, question-headed format: any heading
// ending in "?" paired with the paragraph that immediately follows it.
function extractFaqPairs(blocks: BlogContentBlock[]): { question: string; answer: string }[] {
  const pairs: { question: string; answer: string }[] = [];
  for (let i = 0; i < blocks.length - 1; i++) {
    const heading = blocks[i];
    const next = blocks[i + 1];
    if (heading.type === "heading" && heading.text.trim().endsWith("?") && next.type === "paragraph") {
      pairs.push({ question: heading.text, answer: plainText(next.text) });
    }
  }
  return pairs;
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
  const author = post.author || "Medsol Team";
  const postUrl = `${SITE_URL}/journal/${post.slug}`;
  const faqPairs = extractFaqPairs(blocks);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: post.featuredImage || undefined,
    author: { "@type": "Organization", name: author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    mainEntityOfPage: postUrl,
  };

  const faqJsonLd =
    faqPairs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqPairs.map((pair) => ({
            "@type": "Question",
            name: pair.question,
            acceptedAnswer: { "@type": "Answer", text: pair.answer },
          })),
        }
      : null;

  return (
    <main className="bg-bg-primary pt-32 relative overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <div className="bg-pattern absolute inset-0 opacity-10 pointer-events-none" />

      <article className="py-24 relative z-10">
        <div className="max-content max-w-3xl mx-auto">
          <Link href="/journal" className="text-medsol-gold text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-4 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-medsol-gold mb-6">
            {post.category && <span>{post.category}</span>}
            {post.category && (post.readTime || publishedDate) && <span className="text-white/20">|</span>}
            {post.readTime && <span>{post.readTime}</span>}
            {post.readTime && publishedDate && <span className="text-white/20">|</span>}
            {publishedDate && <span>{publishedDate}</span>}
          </div>

          <h1 className="text-4xl md:text-6xl font-serif leading-tight text-white mb-4">{post.title}</h1>
          <p className="text-text-secondary text-sm font-light mb-12">By {author}</p>

          {post.featuredImage && (
            <div className="aspect-video overflow-hidden mb-16 border border-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-8">
            {blocks.map((block, idx) => {
              if (block.type === "heading") {
                return block.level === 2 ? (
                  <h2 key={idx} className="text-3xl font-serif text-white pt-4">{block.text}</h2>
                ) : (
                  <h3 key={idx} className="text-2xl font-serif text-white pt-2">{block.text}</h3>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={idx} className="list-disc list-outside pl-6 space-y-3 text-text-secondary leading-loose text-lg font-light">
                    {block.items.map((item, i) => (
                      <li key={i}>
                        <InlineText spans={parseInlineSpans(item)} />
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-text-secondary leading-loose text-lg font-light">
                  <InlineText spans={parseInlineSpans(block.text)} />
                </p>
              );
            })}
          </div>
        </div>
      </article>

      <Footer tagline="MEDSOL · Journal." />
    </main>
  );
}
