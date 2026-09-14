"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const pathname = usePathname();
  const symbolMatch = pathname.match(/^\/stock\/([A-Za-z.]+)/);
  const symbol = symbolMatch ? symbolMatch[1].toUpperCase() : undefined;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, symbol }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message || "เกิดข้อผิดพลาด" }]);
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "เชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-signal text-bg shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label="เปิดแชทกับ AI"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-40 w-[90vw] max-w-sm h-[65vh] max-h-[520px] bg-surface border border-border rounded-card shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="font-display font-bold text-sm">
              ผู้ช่วย FinStock<span className="text-signal">AI</span>
            </p>
            <p className="text-xs text-muted">
              {symbol ? `ถามอะไรเกี่ยวกับ ${symbol} หรือการลงทุนได้เลย` : "ถามเรื่องการลงทุนหรือใช้งานเว็บนี้ได้เลย"}
            </p>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-muted text-xs">
                ลองถามเช่น &ldquo;RSI คืออะไร&rdquo; หรือ &ldquo;หุ้นตัวนี้ P/E สูงไปไหม&rdquo;
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] text-sm rounded-card px-3 py-2 ${
                    m.role === "user" ? "bg-signal text-bg" : "bg-surface2 text-text"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface2 text-muted text-sm rounded-card px-3 py-2">กำลังพิมพ์...</div>
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-border p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์คำถาม..."
              className="flex-1 bg-surface2 border border-border rounded-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-signal"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-signal text-bg text-sm font-medium px-3 rounded-card disabled:opacity-50"
            >
              ส่ง
            </button>
          </form>
        </div>
      )}
    </>
  );
}
