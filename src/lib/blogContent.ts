export type BlogContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

/**
 * Parses plain-text blog content into structured blocks. Paragraphs are
 * separated by a blank line; a line starting with "## " or "### " becomes a
 * heading instead of a paragraph. A block where every line starts with "- "
 * becomes a list. Only two heading levels are supported (h2/h3) so the
 * resulting structure always nests validly under the page's single h1 (the
 * post title) with no skipped levels.
 *
 * Paragraph and list-item text may contain inline **bold** and [text](url)
 * links - see parseInlineSpans, applied by the renderer, not here.
 */
export function parseBlogContent(raw: string): BlogContentBlock[] {
  return raw
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): BlogContentBlock => {
      if (block.startsWith("### ")) {
        return { type: "heading", level: 3, text: block.slice(4).trim() };
      }
      if (block.startsWith("## ")) {
        return { type: "heading", level: 2, text: block.slice(3).trim() };
      }

      const lines = block.split("\n").map((line) => line.trim());
      if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
        return { type: "list", items: lines.map((line) => line.slice(2).trim()) };
      }

      return { type: "paragraph", text: block };
    });
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
      spans.push({ type: "link", text: match[2], href: match[3] });
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    spans.push({ type: "text", text: text.slice(lastIndex) });
  }

  return spans;
}
