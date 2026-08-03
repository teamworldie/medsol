import { describe, it, expect } from "vitest";
import { generateToken, hashToken } from "./token";

describe("generateToken", () => {
  it("generates a 64-char hex string", () => {
    const token = generateToken();
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generates unique tokens", () => {
    expect(generateToken()).not.toBe(generateToken());
  });
});

describe("hashToken", () => {
  it("is deterministic", () => {
    const token = generateToken();
    expect(hashToken(token)).toBe(hashToken(token));
  });

  it("produces different hashes for different tokens", () => {
    expect(hashToken(generateToken())).not.toBe(hashToken(generateToken()));
  });

  it("never equals the raw token", () => {
    const token = generateToken();
    expect(hashToken(token)).not.toBe(token);
  });
});
