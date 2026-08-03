"use client";

import { useMemo, useState } from "react";

type CalendarViewing = {
  id: string;
  scheduledAt: string;
  status: string;
  leadName: string;
  propertyTitle: string;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function statusDotClass(status: string) {
  if (status === "SCHEDULED") return "bg-blue-500";
  if (status === "COMPLETED") return "bg-green-500";
  if (status === "CANCELLED") return "bg-red-500";
  return "bg-gray-400";
}

export default function ViewingsCalendar({ viewings }: { viewings: CalendarViewing[] }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const byDay = useMemo(() => {
    const map = new Map<string, CalendarViewing[]>();
    for (const v of viewings) {
      const d = new Date(v.scheduledAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const list = map.get(key) ?? [];
      list.push(v);
      map.set(key, list);
    }
    return map;
  }, [viewings]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">
          {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="rounded-md border border-gray-200 px-2.5 py-1 text-sm text-gray-600 hover:bg-gray-50"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
            className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="rounded-md border border-gray-200 px-2.5 py-1 text-sm text-gray-600 hover:bg-gray-50"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-md overflow-hidden text-xs">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="bg-gray-50 px-2 py-2 text-center font-medium text-gray-500">
            {label}
          </div>
        ))}
        {cells.map((day, i) => {
          const dayViewings = day ? byDay.get(`${year}-${month}-${day}`) ?? [] : [];
          return (
            <div
              key={i}
              className={`bg-white min-h-[90px] px-2 py-2 align-top ${day === null ? "bg-gray-50" : ""}`}
            >
              {day !== null && (
                <>
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                      isToday(day) ? "bg-gray-900 text-white font-semibold" : "text-gray-500"
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayViewings.slice(0, 3).map((v) => (
                      <div
                        key={v.id}
                        title={`${new Date(v.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${v.leadName} · ${v.propertyTitle}`}
                        className="flex items-center gap-1 truncate rounded bg-gray-50 px-1 py-0.5 text-[10px] text-gray-700"
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDotClass(v.status)}`} />
                        <span className="truncate">{v.leadName}</span>
                      </div>
                    ))}
                    {dayViewings.length > 3 && (
                      <div className="text-[10px] text-gray-400">+{dayViewings.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
