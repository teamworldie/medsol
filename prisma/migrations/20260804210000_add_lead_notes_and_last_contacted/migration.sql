-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "lastContactedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LeadNote_leadId_idx" ON "LeadNote"("leadId");

ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RowLevelSecurity: keep the new table consistent with the rest of the
-- schema (see 20260726120000_enable_row_level_security) - Prisma connects
-- as table owner and bypasses RLS, this only locks out Supabase's
-- PostgREST anon/authenticated roles.
ALTER TABLE "LeadNote" ENABLE ROW LEVEL SECURITY;
