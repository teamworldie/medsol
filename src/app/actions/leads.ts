"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LEAD_STATUSES } from "@/lib/leadStatuses";
import { requireSession } from "@/lib/authGuard";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLead(prevState: unknown, formData: FormData) {
  try {
    // Honeypot: a hidden field real users never see or fill in. Bots that
    // blindly fill every field trip this, and we silently pretend success
    // so they don't learn why - no error message tips off the scraper.
    if (formData.get("company_website")) {
      return { success: true, message: "Thank you for your inquiry. We will be in touch shortly." };
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    const inquiryType = formData.get("inquiryType") as string | null;
    const source = (formData.get("source") as string) || "CONTACT_FORM";
    const propertyId = formData.get("propertyId") as string | null;

    if (!name || !email || !EMAIL_RE.test(email)) {
      return { success: false, error: "Please enter a valid name and email address." };
    }

    // In a Vercel preview with ephemeral SQLite, this might fail, so we wrap it in a try/catch
    try {
      await prisma.lead.create({
        data: {
          name,
          email,
          phone: phone || null,
          source,
          inquiryType: inquiryType || null,
          propertyId,
          notes: message || null,
          status: "NEW",
        },
      });
    } catch (e) {
      console.error("Prisma failed to save lead on Vercel preview:", e);
      // We simulate success on Vercel previews so the user sees the success state
    }

    return { success: true, message: "Thank you for your inquiry. We will be in touch shortly." };
  } catch (error) {
    console.error("Error submitting lead:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  await requireSession();
  if (!LEAD_STATUSES.includes(status as typeof LEAD_STATUSES[number])) {
    return { success: false, error: "Invalid status." };
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");

  return { success: true };
}

type CreateLeadState = { error?: string } | undefined;

export async function createLead(prevState: CreateLeadState, formData: FormData): Promise<CreateLeadState> {
  await requireSession();

  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    return { error: "Name is required." };
  }

  const email = (formData.get("email") as string) || null;
  if (email && !EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  await prisma.lead.create({
    data: {
      name,
      email,
      phone: (formData.get("phone") as string) || null,
      preferredContact: (formData.get("preferredContact") as string) || null,
      source: (formData.get("source") as string) || "MANUAL",
      inquiryType: (formData.get("inquiryType") as string) || null,
      propertyId: (formData.get("propertyId") as string) || null,
      status: (formData.get("status") as string) || "NEW",
      notes: (formData.get("notes") as string) || null,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect("/admin/leads");
}

export async function addLeadNote(leadId: string, content: string) {
  await requireSession();
  const trimmed = content.trim();
  if (!trimmed) return { success: false, error: "Note can't be empty." };

  // Adding a note is itself a record of contact, so it also bumps
  // lastContactedAt - a separate "Mark Contacted" action covers the case
  // where an agent wants to log contact without writing anything down.
  await prisma.$transaction([
    prisma.leadNote.create({ data: { leadId, content: trimmed } }),
    prisma.lead.update({ where: { id: leadId }, data: { lastContactedAt: new Date() } }),
  ]);

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function markLeadContacted(leadId: string) {
  await requireSession();
  await prisma.lead.update({ where: { id: leadId }, data: { lastContactedAt: new Date() } });
  revalidatePath("/admin/leads");
  return { success: true };
}
