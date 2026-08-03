"use server";

import { submitLead as submitLeadAction } from "./leads";

export type LeadFormState = {
  success: boolean;
  message?: string;
  error?: string;
};

// Public-site wrapper around the admin `submitLead` action: normalizes the
// first/last/full name field variants used by the different MEDSOL forms
// into the single `name` field the Lead model expects, and tags the source
// as coming from the website (rather than the admin's own default).
export async function submitLead(prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const fullName = formData.get("fullName") as string | null;
  if (fullName) {
    formData.set("name", fullName);
  } else {
    const firstName = (formData.get("firstName") as string) || "";
    const lastName = (formData.get("lastName") as string) || "";
    formData.set("name", `${firstName} ${lastName}`.trim());
  }

  if (!formData.get("source")) {
    formData.set("source", "WEBSITE");
  }

  return submitLeadAction(prevState, formData);
}
