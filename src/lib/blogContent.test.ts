import { describe, expect, it } from "vitest";
import { parseBlogContent, parseInlineSpans } from "@/lib/blogContent";

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

  it("treats a block as a paragraph if not every line starts with '- '", () => {
    const result = parseBlogContent("- First item\nNot a list line");
    expect(result).toEqual([
      { type: "paragraph", text: "- First item\nNot a list line" },
    ]);
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
