import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyForm from "../../PropertyForm";
import { updateProperty } from "@/app/actions/properties";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [property, types, features] = await Promise.all([
    prisma.property.findUnique({ where: { id } }),
    prisma.propertyType.findMany({ orderBy: { name: "asc" } }),
    prisma.propertyFeature.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!property) notFound();

  const boundAction = updateProperty.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-gray-500 mt-1">{property.title}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <PropertyForm
          action={boundAction}
          submitLabel="Save Changes"
          availableTypes={types.map((t) => t.name)}
          availableFeatures={features.map((f) => f.name)}
          initial={property}
        />
      </div>
    </div>
  );
}
