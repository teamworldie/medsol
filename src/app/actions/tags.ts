"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TAG_COLORS } from "@/lib/tagColors";
import { requireSession } from "@/lib/authGuard";

function normalizeTagName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export async function addTagToLead(leadId: string, tagName: string, color?: string) {
  await requireSession();
  const name = normalizeTagName(tagName);
  if (!name) return { success: false, error: "Tag name is required." };

  const tag = await prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name, color: color && TAG_COLORS.includes(color as (typeof TAG_COLORS)[number]) ? color : "gray" },
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: { tags: { connect: { id: tag.id } } },
  });

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function removeTagFromLead(leadId: string, tagId: string) {
  await requireSession();
  await prisma.lead.update({
    where: { id: leadId },
    data: { tags: { disconnect: { id: tagId } } },
  });

  revalidatePath("/admin/leads");
  return { success: true };
}
