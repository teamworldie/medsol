"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/authGuard";
import { slugify } from "@/lib/slug";
import { calculateReadTime } from "@/lib/readTime";

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

function readBlogForm(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || !content) {
    return { error: "Title and content are required." } as const;
  }

  return {
    data: {
      title,
      content,
      excerpt: (formData.get("excerpt") as string) || null,
      category: (formData.get("category") as string) || null,
      readTime: calculateReadTime(content),
      featuredImage: (formData.get("featuredImage") as string) || null,
    },
    published: formData.get("published") === "on",
  } as const;
}

export async function createBlogPost(prevState: any, formData: FormData) {
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
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, prevState: any, formData: FormData) {
  await requireSession();
  const parsed = readBlogForm(formData);
  if ("error" in parsed) return { success: false, error: parsed.error };

  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
  const publishedAt = parsed.published ? (existing?.publishedAt ?? new Date()) : null;

  await prisma.blogPost.update({ where: { id }, data: { ...parsed.data, publishedAt } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireSession();
  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
