"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/authGuard";
import { slugify } from "@/lib/slug";
import { calculateReadTime } from "@/lib/readTime";
import { SITE_NAME } from "@/lib/siteConfig";

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
      author: (formData.get("author") as string) || "Medsol Team",
      targetKeyword: (formData.get("targetKeyword") as string) || null,
    },
    published: formData.get("published") === "on",
  } as const;
}

export async function createBlogPost(prevState: unknown, formData: FormData) {
  await requireSession();
  const parsed = readBlogForm(formData);
  if ("error" in parsed) return { success: false, error: parsed.error };

  let slug = await uniqueSlug(parsed.data.title);

  try {
    await prisma.blogPost.create({
      data: { ...parsed.data, slug, publishedAt: parsed.published ? new Date() : null },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      // Another request claimed this slug between our check and our insert - retry once with a unique suffix.
      slug = `${slug}-${Date.now().toString(36)}`;
      await prisma.blogPost.create({
        data: { ...parsed.data, slug, publishedAt: parsed.published ? new Date() : null },
      });
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

  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
  const publishedAt = parsed.published ? (existing?.publishedAt ?? new Date()) : null;

  await prisma.blogPost.update({ where: { id }, data: { ...parsed.data, publishedAt } });

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
