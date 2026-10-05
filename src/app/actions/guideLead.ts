"use server";

import { submitLead as submitLeadAction } from "./leads";
import { GUIDES } from "@/lib/guides";

export type GuideFormState = {
  success: boolean;
  error?: string;
  downloadUrl?: string;
  downloadName?: string;
};

// Captures a lead for a gated guide, then hands back the PDF location for an
// instant download. The lead is created through the shared submitLead so it
// gets the same rate limiting, honeypot, CRM record and team email.
export async function submitGuideLead(_prev: GuideFormState, formData: FormData): Promise<GuideFormState> {
  const guide = GUIDES[(formData.get("guide") as string) as keyof typeof GUIDES];
  if (!guide) return { success: false, error: "Unknown guide." };

  formData.set("name", ((formData.get("fullName") as string) || "").trim());
  formData.set("source", guide.source);
  formData.set("inquiryType", "Guide download");
  formData.set("message", `Downloaded the ${guide.short}. Planning to buy: ${(formData.get("timeline") as string) || "not stated"}.`);

  const result = (await submitLeadAction(null, formData)) as { success: boolean; error?: string };
  if (!result.success) return { success: false, error: result.error };
  return { success: true, downloadUrl: guide.pdfUrl, downloadName: guide.downloadName };
}
