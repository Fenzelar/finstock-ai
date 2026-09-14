export default function Footer() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted">
        <p>FinStock<span className="text-signal">AI</span> — โครงงานเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน</p>
        <p>ข้อมูลราคาจาก Yahoo Finance · บทวิเคราะห์สร้างโดย AI อาจมีความคลาดเคลื่อน</p>
      </div>
    </footer>
  );
}
