export type BlogContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "quote"; text: string }
  | { type: "image"; url: string; alt: string };

// A standalone image line: "![alt text](url)" on its own line - block-level
// rather than an inline span, since a photo dropped into the body reads as
// its own element, not text flowing around it.
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

// Only relative paths and http(s) links are ever rendered as real hrefs/src.
// Blog content is admin-authored, but this closes the gap in case an
// account is ever compromised or content is imported from elsewhere -
// otherwise a "javascript:" or "data:" URL in a [text](url) link (or an
// image src) would run/load on every visitor's page load.
function sanitizeHref(href: string): string {
  const trimmed = href.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "#";
}

// A GFM-style pipe row: "| a | b |" or "a | b" (outer pipes optional).
function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

// The separator row under a table header, e.g. "|---|:---:|---|".
const TABLE_SEPARATOR_ROW = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/;
// A standalone divider line ("---", "___", "***"), dropped rather than
// rendered - common in text pasted from Google Docs/markdown exports.
const DIVIDER_LINE = /^(-{3,}|_{3,}|\*{3,})$/;

/**
 * Parses plain-text blog content into structured blocks: headings ("## " /
 * "### "), lists (consecutive "- " lines), block quotes (consecutive "> "
 * lines), GFM pipe tables, and paragraphs. Only two heading levels are
 * supported (h2/h3) so the resulting structure
 * always nests validly under the page's single h1 (the post title) with no
 * skipped levels.
 *
 * Line-based rather than split-on-blank-line: content pasted from Docs, a
 * chat, or another CMS frequently loses the double-newline between
 * paragraphs, and a heading/list/table line is an unambiguous block
 * boundary on its own - waiting for a blank line before honoring it would
 * silently swallow the following block into the previous paragraph's raw
 * text instead of rendering it.
 *
 * Paragraph, list-item, and table-cell text may contain inline **bold** and
 * [text](url) links - see parseInlineSpans, applied by the renderer, not here.
 */
export function parseBlogContent(raw: string): BlogContentBlock[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: BlogContentBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let quoteLines: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ").trim() });
      paragraphLines = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  }

  function flushQuote() {
    if (quoteLines.length > 0) {
      blocks.push({ type: "quote", text: quoteLines.join(" ").trim() });
      quoteLines = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "") {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (DIVIDER_LINE.test(line)) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({ type: "heading", level: 3, text: line.slice(4).trim() });
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({ type: "heading", level: 2, text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      flushQuote();
      listItems.push(line.slice(2).trim());
      continue;
    }
    flushList();

    if (line.startsWith("> ")) {
      flushParagraph();
      quoteLines.push(line.slice(2).trim());
      continue;
    }
    flushQuote();

    const imageMatch = line.match(IMAGE_LINE);
    if (imageMatch) {
      flushParagraph();
      blocks.push({ type: "image", alt: imageMatch[1].trim(), url: sanitizeHref(imageMatch[2].trim()) });
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && TABLE_SEPARATOR_ROW.test(lines[i + 1].trim())) {
      flushParagraph();
      const headers = splitTableRow(line);
      const rows: string[][] = [];
      i += 2; // skip the header line and the separator line just consumed
      while (i < lines.length && lines[i].trim().includes("|")) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      i--; // compensate for the loop's own i++
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return blocks;
}

export type InlineSpan =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  | { type: "link"; text: string; href: string };

// Matches **bold** or [text](url) tokens; everything else is captured as
// plain text runs between matches. A small hand-rolled tokenizer rather than
// a markdown dependency, since only these two inline forms are supported.
const INLINE_PATTERN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

export function parseInlineSpans(text: string): InlineSpan[] {
  const spans: InlineSpan[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      spans.push({ type: "text", text: text.slice(lastIndex, index) });
    }

    if (match[1] !== undefined) {
      spans.push({ type: "bold", text: match[1] });
    } else {
      spans.push({ type: "link", text: match[2], href: sanitizeHref(match[3]) });
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    spans.push({ type: "text", text: text.slice(lastIndex) });
  }

  return spans;
}

// The internal pages every blog post is expected to reference at some
// point - kept here (not just hardcoded per-post) so both the automatic
// linking below and the "mentions" entity schema (journal/[slug]/page.tsx)
// share one source of truth for what counts as a linkable entity.
export const AUTO_LINK_ENTITIES: Record<string, string> = {
  "Omala Residences": "/omala-residences",
  "Alhama Nature": "/alhama-nature",
  "Corvera Hills": "/corvera",
};

/**
 * Auto-links the first mention of each known entity (resort names) in a run
 * of inline spans, so an admin writing in the WordPress-style editor gets
 * the same internal linking a hand-written post would have without typing
 * "[Omala Residences](/omala-residences)" themselves. Only "text" spans are
 * scanned - text already inside a manually-written link or **bold** stays
 * untouched. `used` is shared and mutated across every block of one post
 * (passed in by the caller) so only the very first mention of a given
 * entity across the whole article becomes a link, not every occurrence -
 * over-linking every mention reads as spammy and hurts UX.
 */
export function autoLinkSpans(spans: InlineSpan[], used: Set<string>): InlineSpan[] {
  const result: InlineSpan[] = [];

  for (const span of spans) {
    if (span.type !== "text") {
      result.push(span);
      continue;
    }

    let remaining = span.text;
    while (remaining.length > 0) {
      let best: { index: number; phrase: string; href: string } | null = null;
      for (const [phrase, href] of Object.entries(AUTO_LINK_ENTITIES)) {
        if (used.has(phrase)) continue;
        const index = remaining.toLowerCase().indexOf(phrase.toLowerCase());
        if (index !== -1 && (!best || index < best.index)) {
          best = { index, phrase, href };
        }
      }

      if (!best) {
        result.push({ type: "text", text: remaining });
        break;
      }

      if (best.index > 0) {
        result.push({ type: "text", text: remaining.slice(0, best.index) });
      }
      const matchedText = remaining.slice(best.index, best.index + best.phrase.length);
      result.push({ type: "link", text: matchedText, href: best.href });
      used.add(best.phrase);
      remaining = remaining.slice(best.index + best.phrase.length);
    }
  }

  return result;
}
