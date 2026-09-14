"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type SearchResult = { symbol: string; name: string; exchange: string };

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToStock(symbol: string) {
    setOpen(false);
    setQuery("");
    router.push(`/stock/${symbol}`);
  }

  return (
    <div ref={boxRef} className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="ค้นหาหุ้น เช่น AAPL, TSLA..."
        className="w-full bg-surface2 border border-border rounded-card px-3 py-2 text-sm font-mono placeholder:font-body placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-signal"
      />
      {open && query.trim().length > 0 && (
        <div className="absolute mt-1 w-[min(90vw,20rem)] bg-surface border border-border rounded-card shadow-lg overflow-hidden z-30">
          {loading && <div className="px-3 py-2 text-sm text-muted">กำลังค้นหา...</div>}
          {!loading && results.length === 0 && <div className="px-3 py-2 text-sm text-muted">ไม่พบหุ้นที่ตรงกับคำค้นหา</div>}
          {!loading &&
            results.map((r) => (
              <button
                key={r.symbol}
                onClick={() => goToStock(r.symbol)}
                className="w-full text-left px-3 py-2 hover:bg-surface2 transition-colors flex items-center justify-between gap-2"
              >
                <span className="min-w-0">
                  <span className="font-mono font-bold">{r.symbol}</span>{" "}
                  <span className="text-muted text-sm truncate">{r.name}</span>
                </span>
                <span className="text-xs text-muted shrink-0">{r.exchange}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
