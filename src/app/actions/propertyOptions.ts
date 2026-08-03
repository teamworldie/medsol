"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/authGuard";

export async function addPropertyType(name: string) {
  await requireSession();
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Name is required." };

  const type = await prisma.propertyType.upsert({
    where: { name: trimmed },
    update: {},
    create: { name: trimmed },
  });

  revalidatePath("/admin/properties");
  return { success: true, type };
}

export async function addPropertyFeature(name: string) {
  await requireSession();
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Name is required." };

  const feature = await prisma.propertyFeature.upsert({
    where: { name: trimmed },
    update: {},
    create: { name: trimmed },
  });

  revalidatePath("/admin/properties");
  return { success: true, feature };
}
