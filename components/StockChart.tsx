"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickData, LineData } from "lightweight-charts";

type Candle = { time: string; open: number; high: number; low: number; close: number };

export default function StockChart({ candles, sma20, sma50 }: { candles: Candle[]; sma20: (number | null)[]; sma50: (number | null)[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || candles.length === 0) return;
    const chartHeight = window.innerWidth < 640 ? 280 : 420;

    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#8A95A5", fontFamily: "var(--font-jetbrains-mono)" },
      grid: { vertLines: { color: "#232B36" }, horzLines: { color: "#232B36" } },
      width: containerRef.current.clientWidth,
      height: chartHeight,
      timeScale: { borderColor: "#232B36" },
      rightPriceScale: { borderColor: "#232B36" },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#3DDC84", downColor: "#FF5C5C", borderVisible: false, wickUpColor: "#3DDC84", wickDownColor: "#FF5C5C",
    });
    candleSeries.setData(candles as CandlestickData[]);

    const sma20Series = chart.addLineSeries({ color: "#F2B84B", lineWidth: 1, title: "SMA20" });
    const sma20Data = candles
      .map((c, i) => ({ time: c.time, value: sma20[i] }))
      .filter((d): d is { time: any; value: number } => d.value != null) as LineData[];
    sma20Series.setData(sma20Data);

    const sma50Series = chart.addLineSeries({ color: "#8A95A5", lineWidth: 1, title: "SMA50" });
    const sma50Data = candles
      .map((c, i) => ({ time: c.time, value: sma50[i] }))
      .filter((d): d is { time: any; value: number } => d.value != null) as LineData[];
    sma50Series.setData(sma50Data);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth, height: window.innerWidth < 640 ? 280 : 420 });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [candles, sma20, sma50]);

  return <div ref={containerRef} className="w-full" />;
}
