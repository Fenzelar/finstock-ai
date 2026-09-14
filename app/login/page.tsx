"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("สมัครสำเร็จ! ถ้าโปรเจกต์เปิดใช้ email confirmation ให้เช็คอีเมลก่อนเข้าสู่ระบบ");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/watchlist");
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto py-10 md:py-14 px-2">
      <h1 className="font-display font-bold text-xl text-center mb-1">{mode === "signin" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h1>
      <p className="text-muted text-sm text-center mb-6">{mode === "signin" ? "เข้าสู่ระบบเพื่อดู Watchlist ของคุณ" : "สร้างบัญชีเพื่อเริ่มบันทึกหุ้นที่ติดตาม"}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-muted mb-1">อีเมล</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface2 border border-border rounded-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-signal" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">รหัสผ่าน</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface2 border border-border rounded-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-signal" placeholder="อย่างน้อย 6 ตัวอักษร" />
        </div>
        {error && <p className="text-negative text-sm">{error}</p>}
        {message && <p className="text-positive text-sm">{message}</p>}
        <button type="submit" disabled={loading} className="w-full bg-signal text-bg font-medium py-2 rounded-card hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? "กำลังดำเนินการ..." : mode === "signin" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </button>
      </form>
      <p className="text-center text-sm text-muted mt-4">
        {mode === "signin" ? "ยังไม่มีบัญชี? " : "มีบัญชีอยู่แล้ว? "}
        <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setMessage(null); }} className="text-signal hover:underline">
          {mode === "signin" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
        </button>
      </p>
    </div>
  );
}
