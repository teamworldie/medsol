import "server-only";

// Checked in order; first match wins. Signatures are the leading bytes
// that identify each format regardless of what the client claims its
// Content-Type is - the client's Content-Type header is attacker-controlled
// and must never be trusted for upload validation on its own.
const SIGNATURES: { mime: string; ext: string; bytes: number[] }[] = [
  { mime: "image/jpeg", ext: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", ext: "png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/gif", ext: "gif", bytes: [0x47, 0x49, 0x46, 0x38] },
];

export function sniffImageType(bytes: Uint8Array): { mime: string; ext: string } | null {
  for (const sig of SIGNATURES) {
    if (sig.bytes.every((b, i) => bytes[i] === b)) return { mime: sig.mime, ext: sig.ext };
  }
  // WEBP: "RIFF" .... "WEBP" - the middle 4 bytes are a file-size field, so
  // check the two fixed anchors around it rather than a single run of bytes.
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
}
