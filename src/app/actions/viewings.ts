"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { VIEWING_STATUSES } from "@/lib/viewingStatuses";
import { requireSession } from "@/lib/authGuard";

export async function createViewing(prevState: any, formData: FormData) {
  await requireSession();
  const leadId = formData.get("leadId") as string;
  const propertyId = formData.get("propertyId") as string;
  const agentId = (formData.get("agentId") as string) || null;
  const scheduledAtRaw = formData.get("scheduledAt") as string;

  if (!leadId || !propertyId || !scheduledAtRaw) {
    return { success: false, error: "Lead, property, and date/time are required." };
  }

  await prisma.viewing.create({
    data: {
      leadId,
      propertyId,
      agentId,
      scheduledAt: new Date(scheduledAtRaw),
      status: "SCHEDULED",
    },
  });

  revalidatePath("/admin/viewings");
  revalidatePath("/admin");
  redirect("/admin/viewings");
}

export async function updateViewingStatus(id: string, status: string) {
  await requireSession();
  if (!VIEWING_STATUSES.includes(status as typeof VIEWING_STATUSES[number])) {
    return { success: false, error: "Invalid status." };
  }

  await prisma.viewing.update({ where: { id }, data: { status } });

  revalidatePath("/admin/viewings");
  revalidatePath("/admin");

  return { success: true };
}

export async function deleteViewing(id: string) {
  await requireSession();
  await prisma.viewing.delete({ where: { id } });

  revalidatePath("/admin/viewings");
  revalidatePath("/admin");
}
