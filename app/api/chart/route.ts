import { NextResponse } from "next/server";
import { fetchChartData, validateInterval, validateRange } from "@/lib/yahoo-finance/fetchChartData";
import { DEFAULT_INTERVAL, DEFAULT_RANGE } from "@/lib/yahoo-finance/constants";
import type { Interval } from "@/types/yahoo-finance";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const range = validateRange(searchParams.get("range") || DEFAULT_RANGE);
  const interval = validateInterval(range, (searchParams.get("interval") as Interval) || DEFAULT_INTERVAL);
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  try {
    const tryRanges: Array<[string, string]> = [[range, String(interval)], ["3m", "1d"], ["1y", "1wk"]];
    for (const [r, i] of tryRanges) {
      const data = await fetchChartData(symbol, validateRange(r), validateInterval(validateRange(r), i as Interval));
      const points = (data.quotes || [])
        .filter((q) => q.date && q.close !== undefined)
        .map((q) => ({ t: q.date, c: Number(q.close) }));
      if (points.length > 0) return NextResponse.json({ points, rangeTried: r, intervalTried: i });
    }
    return NextResponse.json({ points: [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "chart failed" }, { status: 500 });
  }
}


