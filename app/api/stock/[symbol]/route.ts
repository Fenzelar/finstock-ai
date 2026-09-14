import { NextRequest, NextResponse } from "next/server";
import { fetchStockDetails } from "@/lib/stock";

export async function GET(req: NextRequest, { params }: { params: { symbol: string } }) {
  const range = req.nextUrl.searchParams.get("range") || "6mo";
  const { data, error } = await fetchStockDetails(params.symbol, range);

  if (error || !data) {
    return NextResponse.json(
      { error: "fetch_failed", message: error?.message || "ดึงข้อมูลไม่สำเร็จ" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}