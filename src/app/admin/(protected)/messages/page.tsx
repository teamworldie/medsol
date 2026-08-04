import { prisma } from "@/lib/prisma";
import MessageThreads from "./MessageThreads";

type MessageRow = {
  id: string;
  leadId: string;
  content: string;
  source: string;
  isAiResponse: boolean;
  lead: { name: string } | null;
  createdAt: Date;
};

export default async function MessagesPage() {
  let messages: MessageRow[] = [];

  try {
    messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      include: { lead: true },
      take: 200
    });
  } catch {
    console.error("Prisma failed to load on Vercel preview. Using mock data.");
    // eslint-disable-next-line react-hooks/purity -- fallback-data path in a Server Component, not client render code
    const now = Date.now();
    messages = [
      { id: "1", leadId: "1", content: "Hi, I'm interested in the Sample Property A listing, is it still available?", source: "WEB_CHAT", isAiResponse: false, lead: { name: "Alice Johnson" }, createdAt: new Date(now) },
      { id: "2", leadId: "1", content: "Thanks for reaching out! Yes, Sample Property A is still available. Would you like to schedule a viewing?", source: "AI", isAiResponse: true, lead: { name: "Alice Johnson" }, createdAt: new Date(now - 3600000) },
      { id: "3", leadId: "2", content: "Looking for a 3 bedroom townhouse under €700k in Puerto Banús.", source: "CONTACT_FORM", isAiResponse: false, lead: { name: "Bob Smith" }, createdAt: new Date(now - 86400000) },
    ];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 mt-1">Unified inbox for website chat, AI replies, and contact form inquiries.</p>
      </div>

      <MessageThreads
        messages={messages.map((m) => ({
          id: m.id,
          leadId: m.leadId,
          leadName: m.lead?.name ?? "Unknown",
          content: m.content,
          source: m.source,
          isAiResponse: m.isAiResponse,
          createdAt: new Date(m.createdAt).toISOString(),
        }))}
      />
    </div>
  );
}
