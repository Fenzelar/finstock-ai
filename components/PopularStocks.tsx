"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const POPULAR = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "META", name: "Meta" },
  { symbol: "AMD", name: "AMD" },
];

// Staggered on purpose (not Promise.all) so this list — combined with the
// ticker tape also fetching on page load — doesn't burst too many requests
// at Yahoo Finance at once and trip their rate limit. The server-side cache
// in /api/stock/[symbol] means symbols shared with the ticker tape are
// usually served instantly from cache anyway.
const STAGGER_MS = 300;

type Quote = { price: number; changePercent: number } | null;

export default function PopularStocks() {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadQuotes() {
      for (const { symbol } of POPULAR) {
        if (cancelled) return;
        try {
          const res = await fetch(`/api/stock/${symbol}`);
          const json = await res.json();
          if (!cancelled) {
            setQuotes((prev) => ({ ...prev, [symbol]: { price: json.quote?.price, changePercent: json.quote?.changePercent } }));
          }
        } catch {
          if (!cancelled) setQuotes((prev) => ({ ...prev, [symbol]: null }));
        }
        await new Promise((r) => setTimeout(r, STAGGER_MS));
      }
    }
    loadQuotes();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {POPULAR.map((s) => {
        const q = quotes[s.symbol];
        const isUp = (q?.changePercent ?? 0) >= 0;
        return (
          <Link key={s.symbol} href={`/stock/${s.symbol}`} className="group bg-surface border border-border rounded-card p-4 hover:border-signal transition-colors">
            <div className="min-w-0">
              <p className="font-mono font-bold group-hover:text-signal transition-colors">{s.symbol}</p>
              <p className="text-sm text-muted truncate">{s.name}</p>
            </div>
            <div className="mt-3">
              {q === undefined && <div className="skeleton h-4 w-16 rounded" />}
              {q === null && <p className="text-xs text-muted">ดึงข้อมูลไม่สำเร็จ</p>}
              {q && (
                <p className="font-mono text-sm tabular-nums">
                  {q.price?.toFixed(2)}{" "}
                  <span className={isUp ? "text-positive" : "text-negative"}>
                    {isUp ? "▲" : "▼"} {Math.abs(q.changePercent ?? 0).toFixed(2)}%
                  </span>
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
