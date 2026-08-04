import { describe, it, expect } from "vitest";
import { sniffImageType, sniffPdfType } from "./fileType";

function bytes(...values: number[]): Uint8Array {
  return new Uint8Array(values);
}

describe("sniffImageType", () => {
  it("recognizes a real PNG signature", () => {
    expect(sniffImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0)))
      .toEqual({ mime: "image/png", ext: "png" });
  });

  it("recognizes a real JPEG signature", () => {
    expect(sniffImageType(bytes(0xff, 0xd8, 0xff, 0, 0))).toEqual({ mime: "image/jpeg", ext: "jpg" });
  });

  it("recognizes a real GIF signature", () => {
    expect(sniffImageType(bytes(0x47, 0x49, 0x46, 0x38, 0, 0))).toEqual({ mime: "image/gif", ext: "gif" });
  });

  it("recognizes a real WEBP signature (RIFF....WEBP)", () => {
    const riffWebp = bytes(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50);
    expect(sniffImageType(riffWebp)).toEqual({ mime: "image/webp", ext: "webp" });
  });

  it("rejects a plain text file mislabeled as an image", () => {
    const text = new TextEncoder().encode("not actually a png");
    expect(sniffImageType(text)).toBeNull();
  });

  it("rejects an SVG (no magic-byte signature, would need explicit allowlisting)", () => {
    const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
    expect(sniffImageType(svg)).toBeNull();
  });

  it("rejects an empty buffer", () => {
    expect(sniffImageType(new Uint8Array())).toBeNull();
  });
});

describe("sniffPdfType", () => {
  it("recognizes a real PDF signature", () => {
    const pdf = bytes(0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34);
    expect(sniffPdfType(pdf)).toEqual({ mime: "application/pdf", ext: "pdf" });
  });

  it("rejects a plain text file mislabeled as a PDF", () => {
    const text = new TextEncoder().encode("not actually a pdf");
    expect(sniffPdfType(text)).toBeNull();
  });

  it("rejects a PNG signature", () => {
    expect(sniffPdfType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBeNull();
  });

  it("rejects an empty buffer", () => {
    expect(sniffPdfType(new Uint8Array())).toBeNull();
  });
});
