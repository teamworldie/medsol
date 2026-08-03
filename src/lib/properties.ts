import "server-only";
import { prisma } from "@/lib/prisma";
import type { Property } from "@prisma/client";

export const COMMUNITIES = {
  omala: "Omala Residences",
  alhama: "Alhama Nature",
  corvera: "Corvera Hills",
} as const;

export function getGallery(property: Property): string[] {
  if (!property.images) return [];
  try {
    return JSON.parse(property.images) as string[];
  } catch {
    return [];
  }
}

export async function getPropertiesByCommunity(community: string) {
  return prisma.property.findMany({
    where: { community },
    orderBy: { createdAt: "asc" },
  });
}

export async function getPropertyBySlug(slug: string) {
  return prisma.property.findUnique({ where: { slug } });
}
