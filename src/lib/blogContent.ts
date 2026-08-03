export type BlogContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string };

/**
 * Parses plain-text blog content into structured blocks. Paragraphs are
 * separated by a blank line, same as before; a line starting with "## " or
 * "### " becomes a heading instead of a paragraph. Only two heading levels
 * are supported (h2/h3) so the resulting structure always nests validly
 * under the page's single h1 (the post title) with no skipped levels.
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
      return { type: "paragraph", text: block };
    });
}
