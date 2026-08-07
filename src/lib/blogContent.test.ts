import { describe, expect, it } from "vitest";
import { parseBlogContent, parseInlineSpans, autoLinkSpans } from "@/lib/blogContent";

describe("parseBlogContent", () => {
  it("treats blank-line-separated blocks as paragraphs by default", () => {
    const result = parseBlogContent("First paragraph.\n\nSecond paragraph.");
    expect(result).toEqual([
      { type: "paragraph", text: "First paragraph." },
      { type: "paragraph", text: "Second paragraph." },
    ]);
  });

  it("parses ## prefixed lines as h2 headings", () => {
    const result = parseBlogContent("## A Section Title\n\nSome body text.");
    expect(result).toEqual([
      { type: "heading", level: 2, text: "A Section Title" },
      { type: "paragraph", text: "Some body text." },
    ]);
  });

  it("parses ### prefixed lines as h3 headings", () => {
    const result = parseBlogContent("### A Smaller Title\n\nSome body text.");
    expect(result).toEqual([
      { type: "heading", level: 3, text: "A Smaller Title" },
      { type: "paragraph", text: "Some body text." },
    ]);
  });

  it("ignores empty blocks and trims whitespace", () => {
    const result = parseBlogContent("  Hello.  \n\n\n\n## Title  \n\n");
    expect(result).toEqual([
      { type: "paragraph", text: "Hello." },
      { type: "heading", level: 2, text: "Title" },
    ]);
  });

  it("parses a block of consecutive '- ' lines as a list", () => {
    const result = parseBlogContent("- First item\n- Second item\n- Third item");
    expect(result).toEqual([
      { type: "list", items: ["First item", "Second item", "Third item"] },
    ]);
  });

  it("ends a list block as soon as a non '- ' line appears, even without a blank line", () => {
    const result = parseBlogContent("- First item\nNot a list line");
    expect(result).toEqual([
      { type: "list", items: ["First item"] },
      { type: "paragraph", text: "Not a list line" },
    ]);
  });

  it("splits blocks on heading/list/table lines even with no blank line between them", () => {
    // Real-world paste (Docs, chat) often loses the double-newline between
    // blocks - a heading/list/table line must still start a new block.
    const result = parseBlogContent(
      "Intro paragraph.\n## A Heading\nBody paragraph.\n- item one\n- item two\nClosing paragraph."
    );
    expect(result).toEqual([
      { type: "paragraph", text: "Intro paragraph." },
      { type: "heading", level: 2, text: "A Heading" },
      { type: "paragraph", text: "Body paragraph." },
      { type: "list", items: ["item one", "item two"] },
      { type: "paragraph", text: "Closing paragraph." },
    ]);
  });

  it("drops standalone divider lines (---, ___, ***)", () => {
    const result = parseBlogContent("First paragraph.\n\n---\n\nSecond paragraph.\n***\nThird paragraph.");
    expect(result).toEqual([
      { type: "paragraph", text: "First paragraph." },
      { type: "paragraph", text: "Second paragraph." },
      { type: "paragraph", text: "Third paragraph." },
    ]);
  });

  it("joins wrapped lines within one paragraph with a space", () => {
    const result = parseBlogContent("Line one\nline two\nline three");
    expect(result).toEqual([{ type: "paragraph", text: "Line one line two line three" }]);
  });

  it("parses a GFM pipe table into headers and rows", () => {
    const result = parseBlogContent(
      "| Resort | Price | Airport |\n|---|---|---|\n| Omala | €335k+ | 15 min |\n| Alhama | €400k+ | 20 min |"
    );
    expect(result).toEqual([
      {
        type: "table",
        headers: ["Resort", "Price", "Airport"],
        rows: [
          ["Omala", "€335k+", "15 min"],
          ["Alhama", "€400k+", "20 min"],
        ],
      },
    ]);
  });

  it("parses a table without outer pipes", () => {
    const result = parseBlogContent("A | B\n---|---\n1 | 2");
    expect(result).toEqual([
      { type: "table", headers: ["A", "B"], rows: [["1", "2"]] },
    ]);
  });

  it("does not treat a single-line paragraph containing a pipe as a table", () => {
    const result = parseBlogContent("Price | includes VAT, not a table.");
    expect(result).toEqual([
      { type: "paragraph", text: "Price | includes VAT, not a table." },
    ]);
  });

  it("parses a block of consecutive '> ' lines as a quote", () => {
    const result = parseBlogContent("> This is a quote.\n> It continues here.");
    expect(result).toEqual([
      { type: "quote", text: "This is a quote. It continues here." },
    ]);
  });

  it("ends a quote block as soon as a non '> ' line appears, even without a blank line", () => {
    const result = parseBlogContent("> A quote.\nBack to normal text.");
    expect(result).toEqual([
      { type: "quote", text: "A quote." },
      { type: "paragraph", text: "Back to normal text." },
    ]);
  });

  it("parses a standalone image line as an image block", () => {
    const result = parseBlogContent("Some text.\n![A villa pool](https://example.com/pool.jpg)\nMore text.");
    expect(result).toEqual([
      { type: "paragraph", text: "Some text." },
      { type: "image", alt: "A villa pool", url: "https://example.com/pool.jpg" },
      { type: "paragraph", text: "More text." },
    ]);
  });

  it("rejects an unsafe image URL, falling back to '#'", () => {
    const result = parseBlogContent("![alt](javascript:alert1)");
    expect(result).toEqual([{ type: "image", alt: "alt", url: "#" }]);
  });
});

describe("parseInlineSpans", () => {
  it("returns a single text span for plain text", () => {
    expect(parseInlineSpans("Just plain text.")).toEqual([
      { type: "text", text: "Just plain text." },
    ]);
  });

  it("parses **bold** text", () => {
    expect(parseInlineSpans("This is **important** news.")).toEqual([
      { type: "text", text: "This is " },
      { type: "bold", text: "important" },
      { type: "text", text: " news." },
    ]);
  });

  it("parses [text](url) links", () => {
    expect(parseInlineSpans("See [Omala Residences](/omala-residences) for details.")).toEqual([
      { type: "text", text: "See " },
      { type: "link", text: "Omala Residences", href: "/omala-residences" },
      { type: "text", text: " for details." },
    ]);
  });

  it("handles bold and links together", () => {
    expect(parseInlineSpans("**Note:** visit [our site](https://medsol.es) today.")).toEqual([
      { type: "bold", text: "Note:" },
      { type: "text", text: " visit " },
      { type: "link", text: "our site", href: "https://medsol.es" },
      { type: "text", text: " today." },
    ]);
  });
});

describe("autoLinkSpans", () => {
  it("links the first mention of a known entity in plain text", () => {
    const spans = parseInlineSpans("Villas at Omala Residences sit on the golf course.");
    const result = autoLinkSpans(spans, new Set());
    expect(result).toEqual([
      { type: "text", text: "Villas at " },
      { type: "link", text: "Omala Residences", href: "/omala-residences" },
      { type: "text", text: " sit on the golf course." },
    ]);
  });

  it("only links the first mention across a whole post, not every one", () => {
    const used = new Set<string>();
    const first = autoLinkSpans(parseInlineSpans("Omala Residences is lovely."), used);
    const second = autoLinkSpans(parseInlineSpans("We also recommend Omala Residences."), used);
    expect(first).toEqual([
      { type: "link", text: "Omala Residences", href: "/omala-residences" },
      { type: "text", text: " is lovely." },
    ]);
    expect(second).toEqual([{ type: "text", text: "We also recommend Omala Residences." }]);
  });

  it("does not re-link text that is already a manual link", () => {
    const used = new Set<string>();
    const spans = parseInlineSpans("See [Omala Residences](/omala-residences) for details.");
    const result = autoLinkSpans(spans, used);
    expect(result).toEqual(spans);
    expect(used.has("Omala Residences")).toBe(false);
  });

  it("does not touch text inside a **bold** span", () => {
    const used = new Set<string>();
    const spans = parseInlineSpans("**Omala Residences** is our flagship resort.");
    const result = autoLinkSpans(spans, used);
    expect(result).toEqual(spans);
  });

  it("links multiple different entities in the same text", () => {
    const spans = parseInlineSpans("Compare Omala Residences with Alhama Nature and Corvera Hills.");
    const result = autoLinkSpans(spans, new Set());
    expect(result).toEqual([
      { type: "text", text: "Compare " },
      { type: "link", text: "Omala Residences", href: "/omala-residences" },
      { type: "text", text: " with " },
      { type: "link", text: "Alhama Nature", href: "/alhama-nature" },
      { type: "text", text: " and " },
      { type: "link", text: "Corvera Hills", href: "/corvera" },
      { type: "text", text: "." },
    ]);
  });
});
