const FEATURES = [
  { title: "ค้นหาหุ้นได้ทันที", desc: "พิมพ์ชื่อหรือสัญลักษณ์หุ้นอเมริกา ระบบค้นหาแบบ autocomplete ให้เลย" },
  { title: "กราฟราคาแบบมืออาชีพ", desc: "แท่งเทียนพร้อม SMA20/SMA50 อัปเดตจากข้อมูลตลาดจริง ย้อนหลังได้หลายช่วงเวลา" },
  { title: "AI ช่วยวิเคราะห์", desc: "สรุปแนวโน้ม สัญญาณเทคนิค จุดแข็ง-จุดเสี่ยง เป็นภาษาที่เข้าใจง่าย ภายในไม่กี่วินาที" },
];

export default function FeatureHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {FEATURES.map((f) => (
        <div key={f.title} className="bg-surface border border-border rounded-card p-4">
          <div className="w-9 h-9 rounded-full bg-signal/10 text-signal flex items-center justify-center mb-3 font-bold">✦</div>
          <h3 className="font-display font-bold text-sm mb-1">{f.title}</h3>
          <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
