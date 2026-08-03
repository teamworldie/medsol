"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, MEDIA_BUCKET } from "@/lib/supabaseAdmin";
import { requireSession } from "@/lib/authGuard";

export async function deleteMedia(id: string) {
  await requireSession();
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return { success: false, error: "Media not found." };

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (e) {
    console.error(e);
    return { success: false, error: "Media storage is not configured." };
  }

  const { error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([media.path]);
  if (error) {
    console.error("Supabase delete error:", error);
    return { success: false, error: "Failed to delete file from storage." };
  }

  await prisma.media.delete({ where: { id } });

  revalidatePath("/admin/media");
  return { success: true };
}

export async function renameMedia(id: string, filename: string) {
  await requireSession();
  const trimmed = filename.trim();
  if (!trimmed) return { success: false, error: "Filename cannot be empty." };

  await prisma.media.update({ where: { id }, data: { filename: trimmed } });

  revalidatePath("/admin/media");
  return { success: true };
}
