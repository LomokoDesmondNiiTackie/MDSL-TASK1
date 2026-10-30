import { NextRequest, NextResponse } from "next/server";

const BASE = "https://www.alphavantage.co/query";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "stock"; 
  const symbol = (searchParams.get("symbol") ?? "IBM").toUpperCase();
  const key = process.env.ALPHA_VANTAGE_API_KEY;

  if (!key) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  const params = new URLSearchParams({ apikey: key });
  let seriesKey: string;

  if (type === "forex") {
    const clean = symbol.replace("/", "");
    params.set("function", "FX_DAILY");
    params.set("from_symbol", clean.slice(0, 3));
    params.set("to_symbol", clean.slice(3, 6));
    seriesKey = "Time Series FX (Daily)";
  } else {
    params.set("function", "TIME_SERIES_DAILY");
    params.set("symbol", symbol);
    seriesKey = "Time Series (Daily)";
  }
  params.set("outputsize", "compact");

  const res = await fetch(`${BASE}?${params}`, { next: { revalidate: 300 } });
  const json = await res.json();

  const series = json[seriesKey];
  if (!series) {
    const msg =
      json["Error Message"] || json["Note"] || json["Information"] || "No data returned";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const data = Object.entries(series as Record<string, Record<string, string>>)
    .map(([date, v]) => ({
      date,
      open: +v["1. open"],
      high: +v["2. high"],
      low: +v["3. low"],
      close: +v["4. close"],
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-80);

  return NextResponse.json({ symbol, type, data });
}