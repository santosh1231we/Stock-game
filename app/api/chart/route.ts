import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "AAPL";
  const range = searchParams.get("range") || "1mo";
  const interval = searchParams.get("interval") || "1d";

  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbol
    )}?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ error: "Upstream error" }, { status: res.status });
    const data = await res.json();

    if (!data?.chart || data.chart.error) {
      return NextResponse.json({ error: data?.chart?.error || "Invalid response" }, { status: 400 });
    }

    const result = data.chart.result?.[0];
    if (!result) return NextResponse.json({ error: "No result" }, { status: 404 });

    const timestamps: number[] = (result.timestamp || []).map((ts: number) => ts * 1000);
    const quote = result.indicators?.quote?.[0] || {};

    const chartData = timestamps.map((time: number, i: number) => ({
      time,
      open: quote.open?.[i] ?? null,
      high: quote.high?.[i] ?? null,
      low: quote.low?.[i] ?? null,
      close: quote.close?.[i] ?? null,
      volume: quote.volume?.[i] ?? null,
    }));

    // Back-compat for existing clients expecting { points: [{ t, c }] }
    const points = chartData
      .filter((d: any) => d.time && d.close != null)
      .map((d: any) => ({ t: d.time, c: Number(d.close) }));

    return NextResponse.json({ chartData, meta: result.meta, points });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch data" }, { status: 500 });
  }
}


