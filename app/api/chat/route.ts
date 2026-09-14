import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "missing_api_key", message: "ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน .env.local" },
      { status: 500 }
    );
  }

  const { messages, symbol }: { messages: ChatMessage[]; symbol?: string } = await req.json();

  const systemInstruction = `
คุณคือผู้ช่วย AI ของเว็บ FinStock AI ตอบคำถามเกี่ยวกับการลงทุนหุ้นอเมริกา แนวคิดการเงิน
และการใช้งานเว็บไซต์นี้ ตอบเป็นภาษาไทย กระชับ เข้าใจง่าย
ห้ามให้คำแนะนำการลงทุนแบบฟันธง (เช่น "ซื้อเลย" หรือ "ขายเลย") ให้อธิบายข้อมูล/แนวคิดแทน
${symbol ? `ตอนนี้ผู้ใช้กำลังดูหน้าหุ้น ${symbol} อยู่ ถ้าคำถามเกี่ยวข้องให้อ้างอิงบริบทนี้ได้` : ""}
`.trim();

  // Gemini's chat format alternates user/model roles
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: { temperature: 0.6 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini chat error:", errText);
      return NextResponse.json(
        { error: "chat_failed", message: "แชทไม่สำเร็จ ลองใหม่อีกครั้ง" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      return NextResponse.json({ error: "empty_response", message: "AI ไม่ตอบกลับ" }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "unexpected_error", message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
