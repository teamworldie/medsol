import { describe, expect, it } from "vitest";
import { spainDateTimeLocalToUtc, utcToSpainDateTimeLocal } from "./timezone";

describe("spainDateTimeLocalToUtc", () => {
  it("converts a summer (CEST, UTC+2) wall-clock time to UTC", () => {
    const result = spainDateTimeLocalToUtc("2026-08-10T15:30");
    expect(result.toISOString()).toBe("2026-08-10T13:30:00.000Z");
  });

  it("converts a winter (CET, UTC+1) wall-clock time to UTC", () => {
    const result = spainDateTimeLocalToUtc("2026-01-10T15:30");
    expect(result.toISOString()).toBe("2026-01-10T14:30:00.000Z");
  });
});

describe("utcToSpainDateTimeLocal", () => {
  it("is the inverse of spainDateTimeLocalToUtc for a summer date", () => {
    const utc = spainDateTimeLocalToUtc("2026-08-10T15:30");
    expect(utcToSpainDateTimeLocal(utc)).toBe("2026-08-10T15:30");
  });

  it("is the inverse of spainDateTimeLocalToUtc for a winter date", () => {
    const utc = spainDateTimeLocalToUtc("2026-01-10T15:30");
    expect(utcToSpainDateTimeLocal(utc)).toBe("2026-01-10T15:30");
  });
});
