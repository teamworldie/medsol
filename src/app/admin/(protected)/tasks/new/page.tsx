import { prisma } from "@/lib/prisma";
import { createTask } from "@/app/actions/tasks";
import NewTaskForm from "./NewTaskForm";

export default async function NewTaskPage() {
  let agents: { id: string; name: string | null; email: string }[] = [];
  let leads: { id: string; name: string }[] = [];

  try {
    [agents, leads] = await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, email: true } }),
      prisma.lead.findMany({ select: { id: true, name: true }, orderBy: { createdAt: "desc" }, take: 100 }),
    ]);
  } catch (e) {
    console.error("Prisma failed to load agents/leads for task form:", e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Task</h1>
        <p className="text-gray-500 mt-1">Create a follow-up or to-do.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-2xl">
        <NewTaskForm action={createTask} agents={agents} leads={leads} />
      </div>
    </div>
  );
}
