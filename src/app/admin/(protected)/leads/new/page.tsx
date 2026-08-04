import { prisma } from "@/lib/prisma";
import { createLead } from "@/app/actions/leads";
import NewLeadForm from "./NewLeadForm";

export default async function NewLeadPage() {
  let properties: { id: string; title: string }[] = [];

  try {
    properties = await prisma.property.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (e) {
    console.error("Prisma failed to load properties for lead form:", e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Lead</h1>
        <p className="text-gray-500 mt-1">Manually log an inquiry received by phone, in person, or elsewhere.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-2xl">
        <NewLeadForm action={createLead} properties={properties} />
      </div>
    </div>
  );
}
