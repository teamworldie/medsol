import { describe, expect, it } from "vitest";
import { parseBlogContent } from "@/lib/blogContent";

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
});
