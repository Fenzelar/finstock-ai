"use client";

import { useState } from "react";

type Analysis = {
  summary: string;
  trend: "bullish" | "bearish" | "neutral";
  technicalSignals: string[];
  strengths: string[];
  risks: string[];
  riskLevel: "low" | "medium" | "high";
  disclaimer: string;
};

const trendLabel: Record<Analysis["trend"], { text: string; color: string }> = {
  bullish: { text: "แนวโน้มขาขึ้น", color: "text-positive" },
  bearish: { text: "แนวโน้มขาลง", color: "text-negative" },
  neutral: { text: "ไซด์เวย์ / ยังไม่ชัดเจน", color: "text-muted" },
};
const riskLabel: Record<Analysis["riskLevel"], string> = { low: "ความเสี่ยงต่ำ", medium: "ความเสี่ยงปานกลาง", high: "ความเสี่ยงสูง" };

export default function AIAnalysisCard({ requestPayload }: { requestPayload: any }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "วิเคราะห์ไม่สำเร็จ");
        return;
      }
      setAnalysis(data.analysis);
    } catch (err) {
      setError("เชื่อมต่อไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-card p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="font-display font-bold text-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-signal inline-block" />
          บทวิเคราะห์จาก AI
        </h2>
        {!analysis && (
          <button onClick={runAnalysis} disabled={loading} className="bg-signal text-bg font-medium text-sm px-4 py-1.5 rounded-card hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์เลย"}
          </button>
        )}
      </div>

      {error && <p className="text-negative text-sm">{error}</p>}
      {!analysis && !loading && !error && (
        <p className="text-muted text-sm">กดปุ่ม &ldquo;วิเคราะห์เลย&rdquo; เพื่อให้ AI สรุปแนวโน้ม สัญญาณเทคนิค และความเสี่ยงของหุ้นนี้</p>
      )}

      {analysis && (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">{analysis.summary}</p>
          <div className="flex flex-wrap gap-2">
 <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-surface2 ${trendLabel[analysis?.trend]?.color || 'text-gray-400'}`}>
  {trendLabel[analysis?.trend]?.text || analysis?.trend || 'ไม่ระบุ'}
</span>
<span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface2 text-muted">
  {riskLabel[analysis?.riskLevel] || analysis?.riskLevel || 'ความเสี่ยงปานกลาง'}
</span>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wide text-muted mb-1.5">สัญญาณเทคนิค</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">{analysis.technicalSignals.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs uppercase tracking-wide text-positive mb-1.5">จุดแข็ง</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">{analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wide text-negative mb-1.5">ความเสี่ยง</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">{analysis.risks.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          </div>
          <p className="text-xs text-muted border-t border-border pt-3">{analysis.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
