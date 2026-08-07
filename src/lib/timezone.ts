export const SPAIN_TZ = "Europe/Madrid";

// The IANA-offset math needed to treat a `<input type="datetime-local">`
// value as Spain wall-clock time (not the server's local time, which on
// Vercel is UTC) and convert it to a real UTC Date for storage.
function getOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asIfUtc - date.getTime();
}

/**
 * Converts a `<input type="datetime-local">` value (e.g. "2026-08-10T15:30",
 * no timezone info) into the UTC instant it represents when read as Spain
 * wall-clock time - used for scheduling blog posts, so "publish at 9am"
 * means 9am in Madrid regardless of where the admin or the server actually is.
 */
export function spainDateTimeLocalToUtc(value: string): Date {
  const guessUtc = new Date(`${value}:00Z`);
  const offsetMs = getOffsetMs(guessUtc, SPAIN_TZ);
  return new Date(guessUtc.getTime() - offsetMs);
}

/**
 * The inverse: formats a stored UTC Date as a Spain wall-clock
 * "YYYY-MM-DDTHH:mm" string, to pre-fill a datetime-local input.
 */
export function utcToSpainDateTimeLocal(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SPAIN_TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
