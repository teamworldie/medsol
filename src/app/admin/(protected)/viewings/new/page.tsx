import { prisma } from "@/lib/prisma";
import { createViewing } from "@/app/actions/viewings";
import NewViewingForm from "./NewViewingForm";

export default async function NewViewingPage() {
  let leads: { id: string; name: string }[] = [];
  let properties: { id: string; title: string }[] = [];
  let agents: { id: string; name: string | null; email: string }[] = [];

  try {
    [leads, properties, agents] = await Promise.all([
      prisma.lead.findMany({ select: { id: true, name: true }, orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.property.findMany({ select: { id: true, title: true }, orderBy: { createdAt: "desc" } }),
      prisma.user.findMany({ select: { id: true, name: true, email: true } }),
    ]);
  } catch (e) {
    console.error("Prisma failed to load leads/properties/agents for viewing form:", e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule Viewing</h1>
        <p className="text-gray-500 mt-1">Book a property viewing for a lead.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-2xl">
        <NewViewingForm action={createViewing} leads={leads} properties={properties} agents={agents} />
      </div>
    </div>
  );
}
