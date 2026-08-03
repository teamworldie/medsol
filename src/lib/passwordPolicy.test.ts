import { describe, it, expect } from "vitest";
import { validatePassword } from "./passwordPolicy";

describe("validatePassword", () => {
  it("accepts a reasonable password", () => {
    expect(validatePassword("Marbella2026!")).toBeNull();
  });

  it("rejects passwords under 8 characters", () => {
    expect(validatePassword("Abc123")).toMatch(/at least 8/);
  });

  it("rejects passwords with no digit", () => {
    expect(validatePassword("longenoughpassword")).toMatch(/letter and one number/);
  });

  it("rejects passwords with no letter", () => {
    expect(validatePassword("12345678")).not.toBeNull();
  });

  it("rejects known common passwords", () => {
    expect(validatePassword("password1")).toMatch(/too common/);
    expect(validatePassword("PASSWORD1")).toMatch(/too common/);
  });
});
