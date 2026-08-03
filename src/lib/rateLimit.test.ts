import { describe, it, expect } from "vitest";
import { isRateLimited } from "./rateLimit";

describe("isRateLimited", () => {
  it("allows up to `max` attempts within the window", () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key, 5, 60_000)).toBe(false);
    }
  });

  it("blocks once `max` attempts is exceeded", () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 5; i++) isRateLimited(key, 5, 60_000);
    expect(isRateLimited(key, 5, 60_000)).toBe(true);
  });

  it("resets after the window expires", () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 5; i++) isRateLimited(key, 5, -1); // already-expired window
    expect(isRateLimited(key, 5, 60_000)).toBe(false);
  });

  it("tracks separate keys independently", () => {
    const keyA = `test:a:${Math.random()}`;
    const keyB = `test:b:${Math.random()}`;
    for (let i = 0; i < 5; i++) isRateLimited(keyA, 5, 60_000);
    expect(isRateLimited(keyA, 5, 60_000)).toBe(true);
    expect(isRateLimited(keyB, 5, 60_000)).toBe(false);
  });
});
