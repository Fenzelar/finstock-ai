import { NextRequest, NextResponse } from "next/server";
import { yahooFinance } from "@/lib/yahooFinance";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ results: [] });

  try {
    const data = await yahooFinance.search(q, { quotesCount: 8, newsCount: 0 });
    const results = (data.quotes || [])
      .filter((item: any) => item.quoteType === "EQUITY" && item.symbol)
      .map((item: any) => ({ symbol: item.symbol, name: item.shortname || item.longname || item.symbol, exchange: item.exchange || "" }));
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ results: [], error: "search_failed" }, { status: 500 });
  }
}
