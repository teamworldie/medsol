import { prisma } from "@/lib/prisma";
import PropertyForm from "../PropertyForm";
import { createProperty } from "@/app/actions/properties";

export default async function NewPropertyPage() {
  const [types, features] = await Promise.all([
    prisma.propertyType.findMany({ orderBy: { name: "asc" } }),
    prisma.propertyFeature.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Property</h1>
        <p className="text-gray-500 mt-1">Create a new listing.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <PropertyForm
          action={createProperty}
          submitLabel="Create Property"
          availableTypes={types.map((t) => t.name)}
          availableFeatures={features.map((f) => f.name)}
        />
      </div>
    </div>
  );
}
