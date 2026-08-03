"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/authGuard";
import { slugify } from "@/lib/slug";
import { SITE_NAME } from "@/lib/siteConfig";

function parseUrlList(raw: string | null): string | null {
  if (!raw) return null;
  const urls = raw
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  return urls.length > 0 ? JSON.stringify(urls) : null;
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "property";
  let slug = base;
  let suffix = 1;
  while (await prisma.property.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

function parseJsonArrayField(values: string[]): string | null {
  return values.length > 0 ? JSON.stringify(values) : null;
}

function readPropertyForm(formData: FormData) {
  const title = formData.get("title") as string;
  const price = formData.get("price") as string;

  if (!title || !price) {
    return { error: "Title and price are required." } as const;
  }

  const types = formData.getAll("types").map(String).filter(Boolean);
  const features = formData.getAll("features").map(String).filter(Boolean);

  return {
    data: {
      title,
      price,
      secondPrice: (formData.get("secondPrice") as string) || null,
      pricePrefix: (formData.get("pricePrefix") as string) || null,
      status: (formData.get("status") as string) || "AVAILABLE",
      bedrooms: (formData.get("bedrooms") as string) || null,
      bathrooms: (formData.get("bathrooms") as string) || null,
      area: (formData.get("area") as string) || null,
      landArea: (formData.get("landArea") as string) || null,
      type: types.length > 0 ? types.join(", ") : null,
      community: (formData.get("community") as string) || null,
      description: (formData.get("description") as string) || null,
      featuredImage: (formData.get("featuredImage") as string) || null,
      images: parseUrlList(formData.get("images") as string | null),
      videos: parseUrlList(formData.get("videos") as string | null),
      features: parseJsonArrayField(features),
      isFeatured: formData.get("isFeatured") === "yes",
      seoTitle: (formData.get("seoTitle") as string) || null,
      seoDescription: (formData.get("seoDescription") as string) || null,
    },
  } as const;
}

function defaultSeoTitle(title: string, community: string | null) {
  return community ? `${title} in ${community} | ${SITE_NAME}` : `${title} | ${SITE_NAME}`;
}

function defaultSeoDescription(
  title: string,
  price: string,
  community: string | null,
  description: string | null
) {
  if (description) {
    const trimmed = description.trim().replace(/\s+/g, " ");
    return trimmed.length > 155 ? `${trimmed.slice(0, 152)}...` : trimmed;
  }
  const location = community ? ` in ${community}` : "";
  return `${title}${location}, listed at ${price}. Discover this exclusive property with ${SITE_NAME}.`;
}

export async function createProperty(prevState: any, formData: FormData) {
  await requireSession();
  const parsed = readPropertyForm(formData);
  if ("error" in parsed) return { success: false, error: parsed.error };

  let slug = await uniqueSlug(parsed.data.title);

  const seoTitle = parsed.data.seoTitle || defaultSeoTitle(parsed.data.title, parsed.data.community);
  const seoDescription =
    parsed.data.seoDescription ||
    defaultSeoDescription(parsed.data.title, parsed.data.price, parsed.data.community, parsed.data.description);

  try {
    await prisma.property.create({
      data: { ...parsed.data, seoTitle, seoDescription, slug },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      // Another request claimed this slug between our check and our insert - retry once with a unique suffix.
      slug = `${slug}-${Date.now().toString(36)}`;
      await prisma.property.create({
        data: { ...parsed.data, seoTitle, seoDescription, slug },
      });
    } else {
      throw e;
    }
  }

  revalidatePath("/admin/properties");
  revalidatePath("/admin");
  revalidatePath("/", "layout");
  revalidatePath("/buy", "layout");
  redirect("/admin/properties");
}

export async function updateProperty(id: string, prevState: any, formData: FormData) {
  await requireSession();
  const parsed = readPropertyForm(formData);
  if ("error" in parsed) return { success: false, error: parsed.error };

  await prisma.property.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/properties");
  revalidatePath("/admin");
  revalidatePath("/", "layout");
  revalidatePath("/buy", "layout");
  redirect("/admin/properties");
}

export async function deleteProperty(id: string) {
  await requireSession();

  const viewingCount = await prisma.viewing.count({ where: { propertyId: id } });
  if (viewingCount > 0) {
    return {
      success: false,
      error: "This property has scheduled viewings. Cancel or reassign them before deleting.",
    };
  }

  await prisma.property.delete({ where: { id } });

  revalidatePath("/admin/properties");
  revalidatePath("/admin");
  revalidatePath("/", "layout");
  revalidatePath("/buy", "layout");
  return { success: true };
}
