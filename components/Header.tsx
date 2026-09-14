"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import { useAuth } from "@/lib/AuthContext";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    setMenuOpen(false);
    await signOut();
    router.push("/");
  }

  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3 md:gap-6">
        <Link href="/" className="font-display font-bold text-lg tracking-tight shrink-0">
          FinStock<span className="text-signal">AI</span>
        </Link>

        <div className="flex-1 min-w-0 max-w-md">
          <SearchBar />
        </div>

        <nav className="hidden md:flex items-center gap-5 text-sm text-muted ml-auto">
          <Link href="/" className="hover:text-text transition-colors">หน้าแรก</Link>
          <Link href="/watchlist" className="hover:text-text transition-colors">Watchlist</Link>

          {!loading && !user && (
            <Link href="/login" className="bg-signal text-bg font-medium px-3 py-1.5 rounded-card hover:opacity-90 transition-opacity">
              เข้าสู่ระบบ
            </Link>
          )}

          {!loading && user && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted font-mono max-w-[140px] truncate">{user.email}</span>
              <button onClick={handleSignOut} className="hover:text-negative transition-colors">ออกจากระบบ</button>
            </div>
          )}
        </nav>

        <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden shrink-0 p-2 -mr-2 text-muted hover:text-text" aria-label="เมนู">
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 flex flex-col gap-3 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-muted hover:text-text">หน้าแรก</Link>
          <Link href="/watchlist" onClick={() => setMenuOpen(false)} className="text-muted hover:text-text">Watchlist</Link>
          {!loading && !user && (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="bg-signal text-bg font-medium text-center px-3 py-2 rounded-card">
              เข้าสู่ระบบ
            </Link>
          )}
          {!loading && user && (
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted font-mono truncate">{user.email}</span>
              <button onClick={handleSignOut} className="text-negative">ออกจากระบบ</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
