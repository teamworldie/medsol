"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/authGuard";
import { validatePassword } from "@/lib/passwordPolicy";

const USER_ROLES = ["ADMIN", "AGENT"];

export async function createAgent(prevState: any, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const roleRaw = (formData.get("role") as string) || "AGENT";
  const role = USER_ROLES.includes(roleRaw) ? roleRaw : "AGENT";

  if (!name || !email || !password) {
    return { success: false, error: "Name, email, and password are required." };
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "A user with that email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function deleteAgent(id: string) {
  await requireAdmin();

  const [taskCount, viewingCount, leadCount] = await Promise.all([
    prisma.task.count({ where: { agentId: id } }),
    prisma.viewing.count({ where: { agentId: id } }),
    prisma.lead.count({ where: { assignedToId: id } }),
  ]);

  if (taskCount + viewingCount + leadCount > 0) {
    return {
      success: false,
      error: "This agent has assigned tasks, viewings, or leads. Reassign them before deleting.",
    };
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin/settings");
  return { success: true };
}
