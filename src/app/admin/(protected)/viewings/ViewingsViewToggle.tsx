"use client";

import { useState } from "react";
import ViewingsCalendar from "./ViewingsCalendar";

type CalendarViewing = {
  id: string;
  scheduledAt: string;
  status: string;
  leadName: string;
  propertyTitle: string;
};

export default function ViewingsViewToggle({
  viewings,
  table,
}: {
  viewings: CalendarViewing[];
  table: React.ReactNode;
}) {
  const [view, setView] = useState<"table" | "calendar">("table");

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-md border border-gray-200 bg-white p-1 text-sm">
        <button
          type="button"
          onClick={() => setView("table")}
          className={`rounded px-3 py-1 font-medium transition-colors ${
            view === "table" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Table
        </button>
        <button
          type="button"
          onClick={() => setView("calendar")}
          className={`rounded px-3 py-1 font-medium transition-colors ${
            view === "calendar" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Calendar
        </button>
      </div>

      {view === "table" ? table : <ViewingsCalendar viewings={viewings} />}
    </div>
  );
}
