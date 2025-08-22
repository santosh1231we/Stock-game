import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import yahooFinance from "yahoo-finance2";

export async function GET(req: Request) {
  noStore();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  if (!q) return NextResponse.json({ results: [] });

  try {
    const res = await yahooFinance.search(q, {
      quotesCount: 10,
      newsCount: 0,
      enableFuzzyQuery: true,
    });

    const results = (res.quotes || [])
      .filter((r: any) =>
        r?.symbol &&
        r?.quoteType !== "OPTION" &&
        !String(r.symbol).includes("=")
      )
      .map((r: any) => ({
        symbol: r.symbol as string,
        name: (r.shortname ?? r.longname ?? r.symbol) as string,
        exchange: (r.exchange ?? "") as string,
        type: (r.quoteType ?? "") as string,
      }));

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "search failed" },
      { status: 500 }
    );
  }
}


