"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";

type WatchlistItem = { symbol: string; price?: number; change?: number; changePercent?: number; name?: string };

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    async function loadWatchlist() {
      const { data, error } = await supabase.from("watchlist").select("symbol").eq("user_id", user!.id).order("created_at", { ascending: false });
      if (error || !data) { setLoading(false); return; }
      const withQuotes = await Promise.all(
        data.map(async (row) => {
          try {
            const res = await fetch(`/api/stock/${row.symbol}`);
            const json = await res.json();
            return { symbol: row.symbol, name: json.quote?.shortName, price: json.quote?.price, change: json.quote?.change, changePercent: json.quote?.changePercent };
          } catch {
            return { symbol: row.symbol };
          }
        })
      );
      setItems(withQuotes);
      setLoading(false);
    }
    loadWatchlist();
  }, [user, authLoading]);

  async function removeSymbol(symbol: string) {
    if (!user) return;
    await supabase.from("watchlist").delete().eq("user_id", user.id).eq("symbol", symbol);
    setItems((prev) => prev.filter((i) => i.symbol !== symbol));
  }

  if (authLoading || loading) return <p className="text-center text-muted py-20">กำลังโหลด...</p>;

  if (!user) {
    return (
      <div className="text-center py-16 md:py-20 px-4">
        <h1 className="font-display font-bold text-xl mb-2">Watchlist</h1>
        <p className="text-muted text-sm mb-4">เข้าสู่ระบบเพื่อดูและบันทึกหุ้นที่คุณติดตาม</p>
        <Link href="/login" className="inline-block bg-signal text-bg font-medium px-4 py-2 rounded-card hover:opacity-90 transition-opacity">เข้าสู่ระบบ</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 md:py-20 px-4">
        <h1 className="font-display font-bold text-xl mb-2">Watchlist ว่างเปล่า</h1>
        <p className="text-muted text-sm mb-4">ไปที่หน้ารายละเอียดหุ้นแล้วกด &ldquo;☆ เพิ่มใน Watchlist&rdquo; เพื่อเริ่มบันทึกหุ้น</p>
        <Link href="/" className="text-signal hover:underline text-sm">กลับไปค้นหาหุ้น</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display font-bold text-xl mb-4">Watchlist ของคุณ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const isUp = (item.change ?? 0) >= 0;
          return (
            <div key={item.symbol} className="bg-surface border border-border rounded-card p-4 flex items-center justify-between">
              <Link href={`/stock/${item.symbol}`} className="flex-1 min-w-0">
                <p className="font-mono font-bold">{item.symbol}</p>
                <p className="text-xs text-muted truncate">{item.name}</p>
                {item.price != null && (
                  <p className="font-mono text-sm mt-1 tabular-nums">
                    {item.price.toFixed(2)}{" "}
                    <span className={isUp ? "text-positive" : "text-negative"}>{isUp ? "▲" : "▼"} {Math.abs(item.changePercent ?? 0).toFixed(2)}%</span>
                  </p>
                )}
              </Link>
              <button onClick={() => removeSymbol(item.symbol)} className="text-muted hover:text-negative text-sm ml-3 shrink-0" title="ลบออกจาก watchlist">✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
