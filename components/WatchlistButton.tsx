"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function WatchlistButton({ symbol }: { symbol: string }) {
  const { user, loading: authLoading } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setChecking(false); return; }
    async function checkExisting() {
      const { data, error } = await supabase.from("watchlist").select("id").eq("user_id", user!.id).eq("symbol", symbol).maybeSingle();
      if (!error) setInWatchlist(!!data);
      setChecking(false);
    }
    checkExisting();
  }, [user, authLoading, symbol]);

  async function toggle() {
    if (!user) { router.push("/login"); return; }
    setBusy(true);
    try {
      if (inWatchlist) {
        await supabase.from("watchlist").delete().eq("user_id", user.id).eq("symbol", symbol);
        setInWatchlist(false);
      } else {
        await supabase.from("watchlist").insert({ user_id: user.id, symbol });
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Watchlist toggle failed:", err);
    } finally {
      setBusy(false);
    }
  }

  if (checking) return null;

  return (
    <button onClick={toggle} disabled={busy} className={`text-sm font-medium px-3 py-1.5 rounded-card border transition-colors disabled:opacity-50 shrink-0 ${inWatchlist ? "border-signal text-signal bg-signal/10" : "border-border text-muted hover:text-text hover:border-text"}`}>
      {inWatchlist ? "★ อยู่ใน Watchlist" : "☆ เพิ่มใน Watchlist"}
    </button>
  );
}
