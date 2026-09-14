import Link from "next/link";

const RANGES = [
  { key: "1mo", label: "1M" },
  { key: "3mo", label: "3M" },
  { key: "6mo", label: "6M" },
  { key: "1y", label: "1Y" },
  { key: "5y", label: "5Y" },
];

export default function RangeSelector({ symbol, current }: { symbol: string; current: string }) {
  return (
    <div className="flex gap-1">
      {RANGES.map((r) => (
        <Link
          key={r.key}
          href={`/stock/${symbol}?range=${r.key}`}
          className={`text-xs font-mono px-2.5 py-1 rounded-card transition-colors ${
            current === r.key ? "bg-signal text-bg font-bold" : "text-muted hover:text-text hover:bg-surface2"
          }`}
        >
          {r.label}
        </Link>
      ))}
    </div>
  );
}
