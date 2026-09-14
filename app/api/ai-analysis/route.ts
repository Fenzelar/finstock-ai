import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const AVAILABLE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

const FALLBACK_ANALYSIS = {
  summary: "ระบบประมวลผล AI กำลังหนาแน่นชั่วคราว ข้อมูลราคาและตัวชี้วัดเทคนิคบนกราฟยังคงถูกต้องและใช้งานได้ปกติ",
  trend: "neutral",
  technicalSignals: [
    "เส้นเฉลี่ยเคลื่อนที่ยังคงทำหน้าที่เป็นแนวรับ/แนวต้านตามสภาวะปกติ",
    "ดัชนี RSI สะท้อนแรงซื้อขายจริงในตลาดขณะนี้"
  ],
  strengths: [
    "ข้อมูลตัวชี้วัดทางเทคนิครวมยังคงมีความน่าเชื่อถือ"
  ],
  risks: [
    "ควรสลับไปวิเคราะห์ร่วมกับกราฟราคาจริงประกอบการตัดสินใจ"
  ],
  riskLevel: "medium",
  disclaimer: "คำเตือน: การลงทุนมีความเสี่ยง ข้อมูลนี้ใช้เพื่อประกอบการศึกษาเบื้องต้นเท่านั้น ไม่ใช่คำแนะนำทางการเงิน"
};

async function fetchAIAnalysis(prompt: string): Promise<any> {
  for (const modelName of AVAILABLE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text) {
        return JSON.parse(text);
      }
    } catch (error: any) {
      console.warn(`[Gemini API] โมเดล ${modelName} ไม่ตอบสนอง ลองโมเดลถัดไป...`);
    }
  }

  return FALLBACK_ANALYSIS;
}

export async function POST(req: NextRequest) {
  try {
    const { symbol, quote, indicators } = await req.json();

    const prompt = `คุณคือผู้เชี่ยวชาญด้านการวิเคราะห์หุ้น ช่วยวิเคราะห์หุ้น ${symbol} จากข้อมูลนี้:
- ราคาปัจจุบัน: $${quote?.price ?? "N/A"} (เปลี่ยนแปลง ${quote?.changePercent ?? 0}%)
- P/E Ratio: ${quote?.peRatio ?? "N/A"}
- RSI (14): ${indicators?.rsi14 ? indicators.rsi14[indicators.rsi14.length - 1]?.toFixed(2) : "N/A"}
- SMA20: ${indicators?.sma20 ? indicators.sma20[indicators.sma20.length - 1]?.toFixed(2) : "N/A"}
- SMA50: ${indicators?.sma50 ? indicators.sma50[indicators.sma50.length - 1]?.toFixed(2) : "N/A"}

กรุณาตอบกลับเป็น JSON Format เดียวดังนี้เท่านั้น:
{
  "summary": "เนื้อหาสรุปภาพรวมสั้นๆ กระชับ 2-3 บรรทัด",
  "trend": "bullish" หรือ "bearish" หรือ "neutral",
  "technicalSignals": ["สัญญาณเทคนิคข้อที่ 1", "สัญญาณเทคนิคข้อที่ 2"],
  "strengths": ["จุดแข็งข้อที่ 1", "จุดแข็งข้อที่ 2"],
  "risks": ["ความเสี่ยงข้อที่ 1"],
  "riskLevel": "low" หรือ "medium" หรือ "high",
  "disclaimer": "คำเตือน: การลงทุนมีความเสี่ยง ข้อมูลนี้ใช้เพื่อประกอบการตัดสินใจเบื้องต้นเท่านั้น"
}`;

    const analysisData = await fetchAIAnalysis(prompt);

    return NextResponse.json({ analysis: analysisData });
  } catch (err: any) {
    console.error("Gemini Route Error:", err);
    return NextResponse.json(
      { analysis: FALLBACK_ANALYSIS },
      { status: 200 }
    );
  }
}