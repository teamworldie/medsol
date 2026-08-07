-- Optional disclaimer shown above the author box, for posts covering
-- money/tax/legal/visa topics per the client's sign-off block spec.
ALTER TABLE "BlogPost" ADD COLUMN "disclaimer" TEXT;

-- Full author bio sentence for the end-of-post author box (distinct from
-- authorTitle, the short credential line shown in the byline).
ALTER TABLE "BlogPost" ADD COLUMN "authorBio" TEXT;
