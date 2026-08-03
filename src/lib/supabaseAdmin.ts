import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "media";

let cachedClient: SupabaseClient | null = null;

// Lazily constructed so a missing env var only fails the specific request
// that needs it, rather than throwing at module-load time - which Next.js
// evaluates during the production build itself and would take down the
// entire deployment if this ran at import time.
export function getSupabaseAdmin(): SupabaseClient {
  if (cachedClient) return cachedClient;

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to use Supabase Storage."
    );
  }

  cachedClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  return cachedClient;
}
