import FeatureHighlights from "@/components/FeatureHighlights";
import PopularStocks from "@/components/PopularStocks";

export default function Home() {
  return (
    <div className="space-y-10 md:space-y-14">
      <section className="hero-glow pt-8 md:pt-14 pb-2 text-center rounded-card">
        <span className="inline-block text-xs font-medium text-signal bg-signal/10 border border-signal/30 rounded-full px-3 py-1 mb-4">
          ขับเคลื่อนด้วย Gemini AI
        </span>
        <h1 className="font-display font-bold text-2xl md:text-4xl leading-tight max-w-2xl mx-auto">
          วิเคราะห์หุ้นอเมริกา ด้วยข้อมูลจริง + <span className="text-signal">AI</span>
        </h1>
        <p className="text-muted text-sm md:text-base mt-3 max-w-xl mx-auto">
          ค้นหาหุ้นที่มุมบนของหน้านี้ ดูกราฟราคาแบบเรียลไทม์ พร้อมให้ AI สรุปแนวโน้มและความเสี่ยงให้คุณ
        </p>
      </section>
      <section><FeatureHighlights /></section>
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm uppercase tracking-wide text-muted">หุ้นยอดนิยม</h2>
          <span className="text-xs text-muted font-mono">อัปเดตราคาสด</span>
        </div>
        <PopularStocks />
      </section>
    </div>
  );
}
