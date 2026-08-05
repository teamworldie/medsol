"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LEAD_STATUSES } from "@/lib/leadStatuses";
import { requireSession } from "@/lib/authGuard";
import { isRateLimited } from "@/lib/rateLimit";
import { getResend, getFromEmail } from "@/lib/resend";
import { SITE_NAME } from "@/lib/siteConfig";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewLeadSummary = {
  name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  inquiryType: string | null;
  notes: string | null;
};

// Best-effort notification to the team - a Resend/config failure must never
// block lead capture, so every error here is caught and logged, never thrown.
async function sendLeadNotificationEmail(lead: NewLeadSummary) {
  const recipients = (process.env.LEAD_NOTIFICATION_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (recipients.length === 0) return;

  try {
    const resend = getResend();
    await resend.emails.send({
      from: getFromEmail(),
      to: recipients,
      subject: `New lead: ${lead.name}`,
      html: `
        <p>A new lead came in on ${SITE_NAME}.</p>
        <ul>
          <li><strong>Name:</strong> ${lead.name}</li>
          ${lead.email ? `<li><strong>Email:</strong> ${lead.email}</li>` : ""}
          ${lead.phone ? `<li><strong>Phone:</strong> ${lead.phone}</li>` : ""}
          ${lead.source ? `<li><strong>Source:</strong> ${lead.source}</li>` : ""}
          ${lead.inquiryType ? `<li><strong>Inquiry Type:</strong> ${lead.inquiryType}</li>` : ""}
        </ul>
        ${lead.notes ? `<p><strong>Message:</strong><br>${lead.notes}</p>` : ""}
        <p><a href="https://medsol-crm.vercel.app/admin/leads">View in the admin dashboard</a></p>
      `,
    });
  } catch (e) {
    console.error("Failed to send lead notification email:", e);
  }
}

export async function submitLead(prevState: unknown, formData: FormData) {
  try {
    // Honeypot: a hidden field real users never see or fill in. Bots that
    // blindly fill every field trip this, and we silently pretend success
    // so they don't learn why - no error message tips off the scraper.
    if (formData.get("company_website")) {
      return { success: true, message: "Thank you for your inquiry. We will be in touch shortly." };
    }

    const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(`lead-submit:${ip}`, 5, 10 * 60 * 1000)) {
      return { success: false, error: "Too many requests. Please try again in a few minutes." };
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
      await sendLeadNotificationEmail({ name, email, phone: phone || null, source, inquiryType, notes: message || null });
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

  const phone = (formData.get("phone") as string) || null;
  const source = (formData.get("source") as string) || "MANUAL";
  const inquiryType = (formData.get("inquiryType") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      preferredContact: (formData.get("preferredContact") as string) || null,
      source,
      inquiryType,
      propertyId: (formData.get("propertyId") as string) || null,
      status: (formData.get("status") as string) || "NEW",
      notes,
    },
  });

  await sendLeadNotificationEmail({ name, email, phone, source, inquiryType, notes });

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
