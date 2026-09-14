import { NextRequest, NextResponse } from "next/server";
import { yahooFinance } from "@/lib/yahooFinance";

type CacheEntry = { data: any; expires: number };
const CACHE_TTL_MS = 10 * 60 * 1000; // เพิ่มแคชเป็น 10 นาที
const cache = new Map<string, CacheEntry>();

function sma(values: number[], period: number): (number | null)[] {
  return values.map((_, i) => {
    if (i < period - 1) return null;
    const slice = values.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

function rsi(values: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = new Array(values.length).fill(null);
  let gains = 0, losses = 0;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    if (i <= period) {
      gains += gain; losses += loss;
      if (i === period) {
        const avgGain = gains / period, avgLoss = losses / period;
        result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
      }
    } else {
      const prevAvgGain = gains / period, prevAvgLoss = losses / period;
      const avgGain = (prevAvgGain * (period - 1) + gain) / period;
      const avgLoss = (prevAvgLoss * (period - 1) + loss) / period;
      gains = avgGain * period; losses = avgLoss * period;
      result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    }
  }
  return result;
}

export async function GET(req: NextRequest, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  const range = (req.nextUrl.searchParams.get("range") || "6mo") as "1mo" | "3mo" | "6mo" | "1y" | "5y";

  const cacheKey = `${symbol}:${range}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data);
  }

  try {
    // ดึงทีละขั้นตอนแทน Promise.all เพื่อลดการโดน Rate Limit จาก Yahoo
    const quote = await yahooFinance.quote(symbol);
    const chart = await yahooFinance.chart(symbol, { period1: rangeToStartDate(range), interval: "1d" });

    const candles = (chart.quotes || [])
      .filter((q) => q.close != null)
      .map((q) => ({
        time: toDateString(q.date),
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close,
        volume: q.volume,
      }));

    const closes = candles.map((c) => c.close as number);
    const sma20 = sma(closes, 20);
    const sma50 = sma(closes, 50);
    const rsi14 = rsi(closes, 14);

    const responseData = {
      symbol,
      quote: {
        shortName: quote.shortName || symbol,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        previousClose: quote.regularMarketPreviousClose,
        dayHigh: quote.regularMarketDayHigh,
        dayLow: quote.regularMarketDayLow,
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        eps: quote.epsTrailingTwelveMonths,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
        volume: quote.regularMarketVolume,
        avgVolume: quote.averageDailyVolume3Month,
        currency: quote.currency || "USD",
        exchange: quote.fullExchangeName || quote.exchange,
      },
      candles,
      indicators: { sma20, sma50, rsi14 },
    };

    cache.set(cacheKey, { data: responseData, expires: Date.now() + CACHE_TTL_MS });

    return NextResponse.json(responseData);
  } catch (err) {
    console.error(`Stock API error for ${symbol}:`, err);
    const message = err instanceof Error && /too many requests/i.test(err.message)
      ? "Yahoo Finance จำกัดจำนวนคำขอชั่วคราว รอสักครู่แล้วลองใหม่"
      : "ไม่พบข้อมูลหุ้นนี้ หรือดึงข้อมูลไม่สำเร็จ";
    return NextResponse.json({ error: "fetch_failed", message }, { status: 500 });
  }
}

function rangeToStartDate(range: string): Date {
  const now = new Date();
  const days: Record<string, number> = { "1mo": 30, "3mo": 90, "6mo": 182, "1y": 365, "5y": 365 * 5 };
  const d = new Date(now);
  d.setDate(d.getDate() - (days[range] || 182));
  return d;
}

function toDateString(d: Date | string): string {
  if (typeof d === "string") return d.split("T")[0];
  return d.toISOString().split("T")[0];
}