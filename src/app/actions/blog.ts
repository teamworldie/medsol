"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/authGuard";
import { slugify } from "@/lib/slug";
import { calculateReadTime } from "@/lib/readTime";
import { SITE_NAME } from "@/lib/siteConfig";
import { spainDateTimeLocalToUtc } from "@/lib/timezone";

async function uniqueSlug(title: string, ignoreId?: string): Promise<string> {
  const base = slugify(title) || "post";
  let slug = base;
  let suffix = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

function defaultSeoTitle(title: string) {
  return `${title} | ${SITE_NAME}`;
}

function defaultSeoDescription(excerpt: string | null, content: string) {
  const source = excerpt || content;
  const trimmed = source.trim().replace(/\s+/g, " ");
  return trimmed.length > 155 ? `${trimmed.slice(0, 152)}...` : trimmed;
}

function readBlogForm(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    return { error: "Title and content are required." } as const;
  }

  const excerpt = (formData.get("excerpt") as string) || null;
  const seoTitle = (formData.get("seoTitle") as string) || defaultSeoTitle(title);
  const seoDescription = (formData.get("seoDescription") as string) || defaultSeoDescription(excerpt, content);

  return {
    data: {
      title,
      content,
      excerpt,
      category: (formData.get("category") as string) || null,
      readTime: calculateReadTime(content),
      featuredImage: (formData.get("featuredImage") as string) || null,
      seoTitle,
      seoDescription,
      // Left null when blank rather than hardcoded here - the public journal
      // template supplies the standing "Lee Doherty" byline default, so
      // there's one source of truth instead of two defaults to keep in sync.
      author: (formData.get("author") as string) || null,
      authorTitle: (formData.get("authorTitle") as string) || null,
      authorAvatar: (formData.get("authorAvatar") as string) || null,
      authorBio: (formData.get("authorBio") as string) || null,
      disclaimer: (formData.get("disclaimer") as string) || null,
      targetKeyword: (formData.get("targetKeyword") as string) || null,
      // The admin picks this as Spain wall-clock time (the client's market
      // and MedSol's own timezone); converted here to a real UTC instant so
      // "publish at 9am" means 9am in Madrid regardless of server timezone.
      // A future value schedules the post - see getPublishedPosts/BySlug's
      // `publishedAt: { lte: now }` filter, which is what actually keeps a
      // scheduled post hidden until that instant arrives.
      publishedAt:
        formData.get("published") === "on" && formData.get("publishedAt")
          ? spainDateTimeLocalToUtc(formData.get("publishedAt") as string)
          : null,
    },
  } as const;
}

export async function createBlogPost(prevState: unknown, formData: FormData) {
  await requireSession();
  const parsed = readBlogForm(formData);
  if ("error" in parsed) return { success: false, error: parsed.error };

  let slug = await uniqueSlug(parsed.data.title);

  try {
    await prisma.blogPost.create({ data: { ...parsed.data, slug } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      // Another request claimed this slug between our check and our insert - retry once with a unique suffix.
      slug = `${slug}-${Date.now().toString(36)}`;
      await prisma.blogPost.create({ data: { ...parsed.data, slug } });
    } else {
      throw e;
    }
  }

  revalidatePath("/admin/blog");
  revalidatePath("/journal");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, prevState: unknown, formData: FormData) {
  await requireSession();
  const parsed = readBlogForm(formData);
  if ("error" in parsed) return { success: false, error: parsed.error };

  await prisma.blogPost.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/blog");
  revalidatePath("/journal");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireSession();
  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/admin/blog");
  revalidatePath("/journal");
}
