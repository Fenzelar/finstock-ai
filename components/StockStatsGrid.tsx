function formatNumber(n: number | null | undefined, opts: Intl.NumberFormatOptions = {}) {
  if (n == null) return "N/A";
  return new Intl.NumberFormat("en-US", opts).format(n);
}
function formatMarketCap(n: number | null | undefined) {
  if (n == null) return "N/A";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n}`;
}
export default function StockStatsGrid({ quote }: { quote: any }) {
  const stats = [
    { label: "Market Cap", value: formatMarketCap(quote.marketCap) },
    { label: "P/E Ratio", value: formatNumber(quote.peRatio, { maximumFractionDigits: 2 }) },
    { label: "EPS (TTM)", value: formatNumber(quote.eps, { maximumFractionDigits: 2 }) },
    { label: "52W High / Low", value: `${formatNumber(quote.fiftyTwoWeekHigh, { maximumFractionDigits: 2 })} / ${formatNumber(quote.fiftyTwoWeekLow, { maximumFractionDigits: 2 })}` },
    { label: "Day High / Low", value: `${formatNumber(quote.dayHigh)} / ${formatNumber(quote.dayLow)}` },
    { label: "Volume", value: formatNumber(quote.volume) },
    { label: "Avg Volume (3mo)", value: formatNumber(quote.avgVolume) },
    { label: "Exchange", value: quote.exchange || "N/A" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 md:gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-surface border border-border rounded-card p-3 min-w-0">
          <p className="text-xs text-muted mb-1 truncate">{s.label}</p>
          <p className="font-mono text-sm tabular-nums truncate">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
