import "server-only";
import { Resend } from "resend";

let cachedClient: Resend | null = null;

// Lazily constructed so a missing env var only fails the specific request
// that needs it, not the whole build (same pattern as supabaseAdmin.ts).
export function getResend(): Resend {
  if (cachedClient) return cachedClient;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY must be set to send email.");
  }

  cachedClient = new Resend(process.env.RESEND_API_KEY);
  return cachedClient;
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}
