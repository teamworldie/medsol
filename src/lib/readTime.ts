const WORDS_PER_MINUTE = 200;

export function calculateReadTime(content: string): string {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export const BLOG_CATEGORIES = ["Market Insights", "Renovation", "Lifestyle", "Guides", "Design"] as const;
