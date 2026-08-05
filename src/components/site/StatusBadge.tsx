const LABELS: Record<string, string> = {
  RESERVED: "Reserved",
  SOLD: "Sold",
};

// Only AVAILABLE is the default, unmarked state - RESERVED/SOLD get a badge
// so buyers don't inquire about something no longer on the market.
export default function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const label = LABELS[status];
  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-bold ${
        status === "SOLD" ? "bg-red-500/90 text-white" : "bg-medsol-gold text-bg-primary"
      } ${className}`}
    >
      {label}
    </span>
  );
}
