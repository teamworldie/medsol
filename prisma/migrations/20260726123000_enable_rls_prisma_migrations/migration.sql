-- Prisma's own bookkeeping table (_prisma_migrations) lives in the public
-- schema too, so Supabase's PostgREST API exposes it by default just like
-- any application table. It was missed by the previous migration since it
-- isn't one of our `model` definitions - Prisma creates and manages it
-- itself. Same fix, same reasoning: enable RLS with no policies to lock out
-- the anon/authenticated roles PostgREST uses, while Prisma (connecting as
-- the table owner) continues to bypass RLS and manage migrations normally.

ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
