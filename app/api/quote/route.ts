import { NextResponse } from "next/server";
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  try {
    const q = await fetchQuote(symbol);
    return NextResponse.json({
      symbol: q.symbol,
      regularMarketPrice: q.regularMarketPrice,
      regularMarketChangePercent: q.regularMarketChangePercent,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch quote" }, { status: 500 });
  }
}


