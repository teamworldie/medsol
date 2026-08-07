-- Author E-E-A-T fields for the redesigned blog template: a credential line
-- ("Murcia Property Specialist") and headshot shown in the byline and the
-- end-of-post author box, per the GEO-AEO playbook's "own the entity" tactic.
ALTER TABLE "BlogPost" ADD COLUMN "authorTitle" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "authorAvatar" TEXT;
