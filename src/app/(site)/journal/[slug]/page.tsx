import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublishedPostBySlug, getRelatedPosts } from "@/lib/journal";
import { getPlaceholderImage } from "@/lib/blogPlaceholderImage";
import { parseBlogContent, parseInlineSpans, autoLinkSpans, AUTO_LINK_ENTITIES, type BlogContentBlock, type InlineSpan } from "@/lib/blogContent";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import { SPAIN_TZ } from "@/lib/timezone";
import Footer from "@/components/site/Footer";
import ShareBar from "@/components/site/ShareBar";

export const dynamic = "force-dynamic";

const DEFAULT_AUTHOR = "Lee Doherty";
const DEFAULT_AUTHOR_TITLE = "MedSol Real Estate · Murcia property specialist";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || undefined;
  const postUrl = `${SITE_URL}/journal/${post.slug}`;
  const displayImage = post.featuredImage || (await getPlaceholderImage(post.id));

  return {
    title,
    description,
    keywords: post.targetKeyword ? [post.targetKeyword] : undefined,
    alternates: { canonical: postUrl },
    openGraph: {
      title,
      description,
      type: "article",
      url: postUrl,
      images: displayImage ? [displayImage] : undefined,
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
            <a key={i} href={span.href} className="text-medsol-blue underline hover:text-medsol-gold transition-colors">
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

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function AuthorAvatar({ src, name, size }: { src: string | null; name: string; size: "sm" | "lg" }) {
  const dimension = size === "sm" ? 48 : 64;
  const classes =
    size === "sm"
      ? "w-12 h-12 text-lg"
      : "w-16 h-16 text-2xl";

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={dimension}
        height={dimension}
        className={`${classes} rounded-full object-cover border border-gray-200 shrink-0`}
      />
    );
  }
  return (
    <div className={`${classes} rounded-full bg-medsol-blue/10 border border-gray-200 flex items-center justify-center text-medsol-blue font-serif shrink-0`}>
      {name.charAt(0)}
    </div>
  );
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blocks = parseBlogContent(post.content);
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: SPAIN_TZ })
    : null;
  const updatedDate = new Date(post.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: SPAIN_TZ });
  // Only surface "Last updated" once it's meaningfully different from the
  // publish date - otherwise every fresh post would show two identical dates.
  const showUpdatedDate =
    post.publishedAt && new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 24 * 60 * 60 * 1000;

  // Every post is written under the MedSol byline - Lee Doherty by default,
  // not a generic fallback, per the client's standing sign-off spec.
  const author = post.author || DEFAULT_AUTHOR;
  const authorTitle = post.authorTitle || DEFAULT_AUTHOR_TITLE;
  const postUrl = `${SITE_URL}/journal/${post.slug}`;
  const faqPairs = extractFaqPairs(blocks);
  const relatedPosts = await getRelatedPosts(post.slug, post.category);
  const displayImage = post.featuredImage || (await getPlaceholderImage(post.id));
  const relatedImages = await Promise.all(
    relatedPosts.map(async (related) => related.featuredImage || (await getPlaceholderImage(related.id)))
  );

  // The plan's "answer-first" tactic: if the post opens with a paragraph
  // before any heading, treat it as the direct-answer lede and style it
  // distinctly (larger, bolder) so both readers and LLM crawlers can
  // immediately identify the quotable summary.
  const ledeIndex = blocks[0]?.type === "paragraph" ? 0 : -1;

  const headingBlocks = blocks
    .map((block, idx) => ({ block, idx }))
    .filter((entry): entry is { block: Extract<BlogContentBlock, { type: "heading" }>; idx: number } => entry.block.type === "heading" && entry.block.level === 2);

  // Resorts named anywhere in the post become explicit "mentions" entities
  // in the Article schema, per the plan's "own the entity" tactic - a plain
  // text search rather than requiring a manual/auto link, since schema.org
  // mentions is about what the article discusses, not how it's formatted.
  const rawBlockText = (block: BlogContentBlock): string => {
    if (block.type === "list") return block.items.join(" ");
    if (block.type === "table") return [...block.headers, ...block.rows.flat()].join(" ");
    if (block.type === "image") return "";
    return block.text;
  };
  const fullText = blocks.map(rawBlockText).join(" ").toLowerCase();
  const mentions = Object.entries(AUTO_LINK_ENTITIES)
    .filter(([phrase]) => fullText.includes(phrase.toLowerCase()))
    .map(([phrase, path]) => ({
      "@type": "Place",
      name: phrase,
      url: `${SITE_URL}${path}`,
    }));

  // Tracks which entities have already been linked (manually or
  // automatically) so autoLinkSpans only links the first mention of each
  // across the whole post. Pre-seeded with any entity the admin already
  // linked by hand, so auto-linking never adds a redundant second link.
  const autoLinkedPhrases = new Set<string>();
  for (const block of blocks) {
    const texts = block.type === "list" ? block.items : block.type === "table" ? [...block.headers, ...block.rows.flat()] : block.type === "image" ? [] : [block.text];
    for (const text of texts) {
      for (const span of parseInlineSpans(text)) {
        if (span.type !== "link") continue;
        const phrase = Object.entries(AUTO_LINK_ENTITIES).find(([, path]) => path === span.href)?.[0];
        if (phrase) autoLinkedPhrases.add(phrase);
      }
    }
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Journal", item: `${SITE_URL}/journal` },
      { "@type": "ListItem", position: 2, name: post.title, item: postUrl },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: displayImage || undefined,
    author: {
      "@type": "Person",
      name: author,
      jobTitle: authorTitle,
      worksFor: { "@type": "RealEstateAgent", name: SITE_NAME, url: SITE_URL },
    },
    publisher: { "@type": "Organization", name: SITE_NAME },
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    mainEntityOfPage: postUrl,
    mentions: mentions.length > 0 ? mentions : undefined,
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
    <main className="bg-[#FAF7F2] pt-32 relative overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <article className="pt-8 pb-24 md:py-24 relative z-10">
        <div className="max-content max-w-3xl mx-auto">
          <Link href="/journal" className="text-medsol-blue text-[10px] tracking-[0.3em] uppercase mb-8 flex items-center gap-4 hover:text-medsol-gold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-medsol-blue mb-6">
            {post.category && <span>{post.category}</span>}
            {post.category && post.readTime && <span className="text-gray-300">|</span>}
            {post.readTime && <span>{post.readTime}</span>}
          </div>

          <h1 className="text-4xl md:text-6xl font-serif leading-tight text-gray-900 mb-8">{post.title}</h1>

          {/* Author byline - name, credential, avatar, and dates, so both
              readers and crawlers can immediately attribute the post
              (GEO/AEO playbook item 6: "own the entity"). Always shown,
              defaulting to the standing MedSol byline. */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-200">
            <AuthorAvatar src={post.authorAvatar} name={author} size="sm" />
            <div className="text-sm">
              <p className="text-gray-900 font-medium">By {author}</p>
              <p className="text-gray-500 font-light">
                {authorTitle}
                {publishedDate && <span className="text-gray-400"> · {publishedDate}</span>}
              </p>
              {showUpdatedDate && <p className="text-gray-400 font-light text-xs mt-0.5">Updated {updatedDate}</p>}
            </div>
            <div className="ml-auto hidden sm:block">
              <ShareBar url={postUrl} title={post.title} />
            </div>
          </div>

          {displayImage && (
            <div className="aspect-video overflow-hidden mb-16 border border-gray-200 relative">
              <Image src={displayImage} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
            </div>
          )}

          {headingBlocks.length >= 3 && (
            <nav aria-label="Table of contents" className="mb-16 p-6 border border-gray-200 bg-white">
              <p className="text-[10px] tracking-[0.3em] uppercase text-medsol-blue mb-4">In this article</p>
              <ol className="space-y-2">
                {headingBlocks.map(({ block, idx }) => (
                  <li key={idx}>
                    <a href={`#${slugifyHeading(block.text)}`} className="text-gray-600 hover:text-medsol-gold transition-colors font-light">
                      {block.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="space-y-8">
            {blocks.map((block, idx) => {
              if (block.type === "heading") {
                const id = slugifyHeading(block.text);
                return block.level === 2 ? (
                  <h2 key={idx} id={id} className="text-3xl font-serif text-gray-900 pt-4 scroll-mt-32">{block.text}</h2>
                ) : (
                  <h3 key={idx} id={id} className="text-2xl font-serif text-gray-900 pt-2 scroll-mt-32">{block.text}</h3>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={idx} className="list-disc list-outside pl-6 space-y-3 text-gray-700 leading-loose text-lg font-light">
                    {block.items.map((item, i) => (
                      <li key={i}>
                        <InlineText spans={autoLinkSpans(parseInlineSpans(item), autoLinkedPhrases)} />
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote key={idx} className="border-l-2 border-medsol-gold pl-6 py-2 my-4">
                    <p className="font-serif italic text-2xl text-gray-800 leading-snug">
                      <InlineText spans={autoLinkSpans(parseInlineSpans(block.text), autoLinkedPhrases)} />
                    </p>
                  </blockquote>
                );
              }
              if (block.type === "image") {
                return (
                  <div key={idx} className="relative aspect-video overflow-hidden border border-gray-200 my-8">
                    <Image src={block.url} alt={block.alt || post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
                  </div>
                );
              }
              if (block.type === "table") {
                return (
                  <div key={idx} className="overflow-x-auto border border-gray-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          {block.headers.map((header, i) => (
                            <th key={i} className="px-5 py-3 text-[10px] tracking-[0.2em] uppercase text-medsol-blue font-medium border-b border-gray-200">
                              <InlineText spans={parseInlineSpans(header)} />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, r) => (
                          <tr key={r} className="border-b border-gray-100 last:border-0">
                            {row.map((cell, c) => (
                              <td key={c} className="px-5 py-3 text-gray-700 font-light">
                                <InlineText spans={parseInlineSpans(cell)} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              const isLede = idx === ledeIndex;
              return (
                <p
                  key={idx}
                  className={
                    isLede
                      ? "text-gray-900 leading-relaxed text-xl font-medium border-l-2 border-medsol-gold pl-6"
                      : "text-gray-700 leading-loose text-lg font-light"
                  }
                >
                  <InlineText spans={parseInlineSpans(block.text)} />
                </p>
              );
            })}
          </div>

          {post.disclaimer && (
            <div className="mt-12 p-5 border border-gray-200 bg-white text-gray-500 text-sm font-light leading-relaxed">
              {post.disclaimer}
            </div>
          )}

          {/* End-of-post author box - expanded E-E-A-T signal per the GEO/AEO
              plan. Always shown, same default byline as the top. */}
          <div className="mt-16 pt-8 border-t border-gray-200 flex items-center gap-5">
            <AuthorAvatar src={post.authorAvatar} name={author} size="lg" />
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-medsol-blue mb-1">Written by</p>
              <p className="text-gray-900 font-medium">{author}</p>
              <p className="text-gray-500 font-light text-sm">{post.authorBio || authorTitle}</p>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Share this article</p>
            <ShareBar url={postUrl} title={post.title} />
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-24 border-t border-gray-200 relative z-10 bg-white">
          <div className="max-content max-w-5xl mx-auto">
            <p className="text-[10px] tracking-[0.3em] uppercase text-medsol-blue mb-8">Related reading</p>
            <div className="grid md:grid-cols-3 gap-10">
              {relatedPosts.map((related, i) => (
                <Link href={`/journal/${related.slug}`} key={related.id} className="group block space-y-4">
                  <div className="aspect-video overflow-hidden relative bg-gray-100">
                    {relatedImages[i] && (
                      <Image
                        src={relatedImages[i]}
                        alt={related.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-serif text-gray-900 group-hover:text-medsol-gold transition-colors leading-snug">{related.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer tagline="MEDSOL · Journal." />
    </main>
  );
}
