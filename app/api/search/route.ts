import { NextResponse } from "next/server";
import { fetchStockSearch } from "@/lib/yahoo-finance/fetchStockSearch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q || q.trim().length === 0) {
    return NextResponse.json({ quotes: [] });
  }

  try {
    const res = await fetchStockSearch(q, 0, 100);
    const blockSuffix = /(\-BL|\-PP|\-RE|\-R|\-W|NCD|BOND|BONDS)$/i;
    const rank = (sym: string) => (sym.endsWith(".NS") ? 0 : sym.endsWith(".BO") ? 1 : 2);
    const quotes = (res.quotes || [])
      .filter((it: any) => (it.quoteType || "EQUITY") === "EQUITY")
      .filter((it: any) => !blockSuffix.test(it.symbol))
      .sort((a: any, b: any) => rank(a.symbol) - rank(b.symbol))
      .slice(0, 20)
      .map((it: any) => ({
        symbol: it.symbol,
        shortname: it.shortname || it.longname || it.symbol,
        exchDisp: it.exchDisp,
      }));
    return NextResponse.json({ quotes });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "search failed" }, { status: 500 });
  }
}


