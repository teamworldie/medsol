"use server";

import { submitLead as submitLeadAction } from "./leads";

export type InsiderState = { success: boolean; error?: string };

// Murcia Insider sign-ups are stored as leads (source NEWSLETTER) so they land in
// the CRM and the team email, with the campaign tag (?src=linkedin) kept in
// the note so each channel can be measured.
export async function joinInsider(_prev: InsiderState, formData: FormData): Promise<InsiderState> {
  const channel = ((formData.get("channel") as string) || "direct").replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "direct";
  formData.set("name", ((formData.get("fullName") as string) || "").trim());
  formData.set("source", "INSIDER");
  formData.set("inquiryType", "Stay in touch");
  formData.set("message", `Asked to be kept posted (channel: ${channel}).`);
  const result = (await submitLeadAction(null, formData)) as { success: boolean; error?: string };
  return result.success ? { success: true } : { success: false, error: result.error };
}
