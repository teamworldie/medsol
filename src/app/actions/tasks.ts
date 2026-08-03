"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/authGuard";

export async function createTask(prevState: any, formData: FormData) {
  await requireSession();
  const title = formData.get("title") as string;
  const agentId = formData.get("agentId") as string;
  const description = (formData.get("description") as string) || null;
  const dueDateRaw = formData.get("dueDate") as string;
  const leadId = (formData.get("leadId") as string) || null;

  if (!title || !agentId) {
    return { success: false, error: "Title and assigned agent are required." };
  }

  await prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      agentId,
      leadId: leadId || null,
      status: "PENDING",
    },
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
  redirect("/admin/tasks");
}

export async function toggleTaskStatus(id: string, currentStatus: string) {
  await requireSession();
  await prisma.task.update({
    where: { id },
    data: { status: currentStatus === "PENDING" ? "COMPLETED" : "PENDING" },
  });

  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
}

export async function deleteTask(id: string) {
  await requireSession();
  await prisma.task.delete({ where: { id } });

  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
}
