-- Enable Row Level Security on every table in the public schema.
--
-- This app never talks to Supabase's auto-generated PostgREST API (no
-- NEXT_PUBLIC_SUPABASE_* anon key anywhere in the codebase) - all reads and
-- writes go through Prisma over a direct Postgres connection (DATABASE_URL),
-- and file storage uses the server-only service_role key. Supabase still
-- exposes every public-schema table over its REST API by default though,
-- and without RLS enabled that API has zero access control: anyone with the
-- project URL and the (publicly-shareable-by-design) anon key can read,
-- edit, or delete every row - including hashed passwords in "User" and
-- customer PII in "Lead".
--
-- We intentionally add no policies. With RLS enabled and no policy defined,
-- Postgres denies access by default to any role the policies don't name -
-- which fully locks out the anon/authenticated roles PostgREST uses, while
-- leaving Prisma unaffected: it connects as the table owner (the role that
-- ran `prisma migrate`), and table owners bypass RLS unless FORCE ROW LEVEL
-- SECURITY is also set, which we deliberately do not set here.

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PasswordResetToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropertyType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PropertyFeature" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Viewing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_LeadTags" ENABLE ROW LEVEL SECURITY;
