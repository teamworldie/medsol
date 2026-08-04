// Not marked "server-only", and builds its own Supabase client rather than
// importing lib/supabaseAdmin.ts: this module is used by seed.ts, a
// standalone Node script run via `tsx` outside Next.js's build. The
// server-only guard throws unconditionally when required directly by plain
// Node rather than through a bundler that understands its "react-server"
// export condition, and that import happens as soon as the module (or
// anything that imports it) loads - so it can't be avoided just by not
// calling the guarded function.
import fs from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "media";

let cachedClient: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to use Supabase Storage.");
  }
  cachedClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  return cachedClient;
}

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
  const supabase = getClient();
  const { error } = await supabase.storage.createBucket(MEDIA_BUCKET, { public: true });
  if (error && !/already exists/i.test(error.message)) {
    throw error;
  }
}

export async function uploadPublicAsset(localPublicPath: string): Promise<string> {
  const supabase = getClient();
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
