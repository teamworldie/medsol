import { describe, expect, it } from "vitest";
import { calculateReadTime } from "@/lib/readTime";

describe("calculateReadTime", () => {
  it("rounds to the nearest minute", () => {
    const content = Array(300).fill("word").join(" ");
    expect(calculateReadTime(content)).toBe("2 min read");
  });

  it("never returns less than 1 minute", () => {
    expect(calculateReadTime("just a few words")).toBe("1 min read");
    expect(calculateReadTime("")).toBe("1 min read");
  });

  it("ignores extra whitespace between words", () => {
    const content = Array(200).fill("word").join("   \n  ");
    expect(calculateReadTime(content)).toBe("1 min read");
  });
});
