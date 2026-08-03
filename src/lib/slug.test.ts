import { describe, it, expect } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates a normal title", () => {
    expect(slugify("Villa Nubay")).toBe("villa-nubay");
  });

  it("strips accented and special characters", () => {
    expect(slugify("Nueva Andalucía, Marbella")).toBe("nueva-andaluc-a-marbella");
  });

  it("collapses repeated separators into a single hyphen", () => {
    expect(slugify("A   B---C")).toBe("a-b-c");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  --Hello World--  ")).toBe("hello-world");
  });

  it("returns an empty string for input with no alphanumeric characters", () => {
    expect(slugify("!!!")).toBe("");
  });
});
