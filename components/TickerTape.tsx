"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Kept short on purpose — each symbol here costs a Yahoo Finance request.
// Fewer symbols + staggered fetching keeps us well under Yahoo's rate limit.
const TICKER_SYMBOLS = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL", "AMZN"];
const STAGGER_MS = 350;

type TickerQuote = { symbol: string; price: number; changePercent: number };

export default function TickerTape() {
  const [quotes, setQuotes] = useState<TickerQuote[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadQuotes() {
      for (const symbol of TICKER_SYMBOLS) {
        if (cancelled) return;
        try {
          const res = await fetch(`/api/stock/${symbol}`);
          const json = await res.json();
          if (!cancelled && json.quote) {
            setQuotes((prev) => [
              ...prev,
              { symbol, price: json.quote.price ?? 0, changePercent: json.quote.changePercent ?? 0 },
            ]);
          }
        } catch {
          // skip this symbol on failure, keep going with the rest
        }
        await new Promise((r) => setTimeout(r, STAGGER_MS));
      }
    }
    loadQuotes();
    return () => { cancelled = true; };
  }, []);

  if (quotes.length === 0) return <div className="h-10 border-b border-border bg-surface/40" />;

  const row = [...quotes, ...quotes];

  return (
    <div className="border-b border-border bg-surface/40 overflow-hidden">
      <div className="flex w-max animate-ticker py-2">
        {row.map((q, i) => {
          const isUp = q.changePercent >= 0;
          return (
            <Link key={`${q.symbol}-${i}`} href={`/stock/${q.symbol}`} className="flex items-center gap-2 px-4 border-r border-border/60 shrink-0 hover:opacity-80">
              <span className="font-mono text-xs font-bold">{q.symbol}</span>
              <span className="font-mono text-xs tabular-nums text-muted">{q.price.toFixed(2)}</span>
              <span className={`font-mono text-xs tabular-nums ${isUp ? "text-positive" : "text-negative"}`}>
                {isUp ? "▲" : "▼"} {Math.abs(q.changePercent).toFixed(2)}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
