import { describe, it, expect } from "vitest";
import { isRateLimited } from "./rateLimit";

describe("isRateLimited", () => {
  it("allows up to `max` attempts within the window", async () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(await isRateLimited(key, 5, 60_000)).toBe(false);
    }
  });

  it("blocks once `max` attempts is exceeded", async () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 5; i++) await isRateLimited(key, 5, 60_000);
    expect(await isRateLimited(key, 5, 60_000)).toBe(true);
  });

  it("resets after the window expires", async () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 5; i++) await isRateLimited(key, 5, -1); // already-expired window
    expect(await isRateLimited(key, 5, 60_000)).toBe(false);
  });

  it("tracks separate keys independently", async () => {
    const keyA = `test:a:${Math.random()}`;
    const keyB = `test:b:${Math.random()}`;
    for (let i = 0; i < 5; i++) await isRateLimited(keyA, 5, 60_000);
    expect(await isRateLimited(keyA, 5, 60_000)).toBe(true);
    expect(await isRateLimited(keyB, 5, 60_000)).toBe(false);
  });
});
