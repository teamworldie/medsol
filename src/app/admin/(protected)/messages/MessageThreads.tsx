"use client";

import { useMemo, useState } from "react";

type ThreadMessage = {
  id: string;
  content: string;
  source: string;
  isAiResponse: boolean;
  createdAt: string;
};

type Thread = {
  leadId: string;
  leadName: string;
  messages: ThreadMessage[];
};

export default function MessageThreads({ messages }: { messages: (ThreadMessage & { leadId: string; leadName: string })[] }) {
  const threads = useMemo(() => {
    const map = new Map<string, Thread>();
    for (const m of messages) {
      const existing = map.get(m.leadId);
      if (existing) {
        existing.messages.push(m);
      } else {
        map.set(m.leadId, { leadId: m.leadId, leadName: m.leadName, messages: [m] });
      }
    }
    // messages arrive newest-first; sort each thread chronologically for display
    const list = [...map.values()].map((t) => ({
      ...t,
      messages: [...t.messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    }));
    // order threads by most recent message first
    list.sort((a, b) => {
      const aLast = a.messages[a.messages.length - 1].createdAt;
      const bLast = b.messages[b.messages.length - 1].createdAt;
      return new Date(bLast).getTime() - new Date(aLast).getTime();
    });
    return list;
  }, [messages]);

  const [openThread, setOpenThread] = useState<string | null>(threads[0]?.leadId ?? null);

  if (threads.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 text-center text-sm text-gray-500">
        No messages found.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
      {threads.map((thread) => {
        const last = thread.messages[thread.messages.length - 1];
        const isOpen = openThread === thread.leadId;
        return (
          <div key={thread.leadId}>
            <button
              type="button"
              onClick={() => setOpenThread(isOpen ? null : thread.leadId)}
              className="w-full p-6 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{thread.leadName}</span>
                  <span className="text-xs text-gray-400">
                    {thread.messages.length} message{thread.messages.length > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{last.content}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(last.createdAt).toLocaleDateString()}
                </span>
                <span className={`transition-transform text-gray-400 ${isOpen ? "rotate-180" : ""}`}>▾</span>
              </div>
            </button>

            {isOpen && (
              <div className="bg-gray-50 px-6 py-4 space-y-3 border-t border-gray-100">
                {thread.messages.map((m) => (
                  <div key={m.id} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-flex shrink-0 items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        m.isAiResponse ? "bg-purple-100 text-purple-800" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {m.source.replace(/_/g, " ")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800">{m.content}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(m.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
