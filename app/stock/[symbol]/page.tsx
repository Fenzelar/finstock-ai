import StockChart from "@/components/StockChart";
import StockStatsGrid from "@/components/StockStatsGrid";
import AIAnalysisCard from "@/components/AIAnalysisCard";
import WatchlistButton from "@/components/WatchlistButton";
import RangeSelector from "@/components/RangeSelector";
import BackButton from "@/components/BackButton";

async function getStockData(symbol: string, range: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/stock/${symbol}?range=${range}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function StockPage({
  params,
  searchParams,
}: {
  params: { symbol: string };
  searchParams: { range?: string };
}) {
  const range = searchParams.range || "6mo";
  const data = await getStockData(params.symbol, range);

  if (!data || data.error) {
    return (
      <div>
        <BackButton />
        <div className="text-center py-16 md:py-20 px-4">
          <p className="text-lg text-negative">ไม่พบข้อมูลหุ้น &ldquo;{params.symbol}&rdquo;</p>
          <p className="text-muted text-sm mt-2">ลองตรวจสอบสัญลักษณ์หุ้นอีกครั้ง เช่น AAPL, MSFT, GOOGL</p>
        </div>
      </div>
    );
  }

  const { quote, candles, indicators } = data;
  const isUp = (quote.change ?? 0) >= 0;

  return (
    <div className="space-y-5 md:space-y-6">
      <BackButton />

      {/* Price header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-xl md:text-2xl truncate">
            {data.symbol}{" "}
            <span className="text-muted font-body text-sm md:text-base font-normal">{quote.shortName}</span>
          </h1>
          <div className="flex flex-wrap items-baseline gap-2 md:gap-3 mt-1">
            <span className="font-mono text-2xl md:text-3xl tabular-nums">
              {quote.price?.toFixed(2)} <span className="text-sm md:text-base text-muted">{quote.currency}</span>
            </span>
            <span className={`font-mono text-sm tabular-nums ${isUp ? "text-positive" : "text-negative"}`}>
              {isUp ? "▲" : "▼"} {Math.abs(quote.change).toFixed(2)} ({Math.abs(quote.changePercent).toFixed(2)}%)
            </span>
          </div>
        </div>
        <WatchlistButton symbol={data.symbol} />
      </div>

      {/* Chart */}
      <div className="bg-surface border border-border rounded-card p-3 md:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex gap-4 text-xs text-muted font-mono">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-signal inline-block" /> SMA20</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted inline-block" /> SMA50</span>
          </div>
          <RangeSelector symbol={data.symbol} current={range} />
        </div>
        <StockChart candles={candles} sma20={indicators.sma20} sma50={indicators.sma50} />
      </div>

      <StockStatsGrid quote={quote} />

      <AIAnalysisCard requestPayload={{ symbol: data.symbol, quote, candles, indicators }} />
    </div>
  );
}
