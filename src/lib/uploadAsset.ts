import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { getSupabaseAdmin, MEDIA_BUCKET } from "@/lib/supabaseAdmin";

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
};

function sanitizeObjectPath(localPublicPath: string): string {
  const withoutLeadingSlash = localPublicPath.replace(/^\/+/, "");
  return withoutLeadingSlash.replace(/ /g, "-");
}

export async function ensureMediaBucket() {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.createBucket(MEDIA_BUCKET, { public: true });
  if (error && !/already exists/i.test(error.message)) {
    throw error;
  }
}

export async function uploadPublicAsset(localPublicPath: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const filePath = path.join(process.cwd(), "public", localPublicPath);
  const fileBuffer = await fs.readFile(filePath);
  const ext = path.extname(localPublicPath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
  const objectPath = `properties/${sanitizeObjectPath(localPublicPath)}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(objectPath, fileBuffer, {
    contentType,
    upsert: true,
  });
  if (error) {
    throw new Error(`Failed to upload ${localPublicPath} to Supabase Storage: ${error.message}`);
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}
