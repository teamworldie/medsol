import { randomBytes, createHash } from "crypto";

/** A cryptographically random URL-safe token, suitable for putting in an email link. */
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/** One-way hash of a token for storage - the raw token only ever exists in the emailed link. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
