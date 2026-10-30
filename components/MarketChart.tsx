"use client";

import { useEffect, useState } from "react";
import CandlestickChart, { Candle } from "./CandlestickChart";

type Mode = "stock" | "forex";

const PRESETS: Record<Mode, string[]> = {
  stock: ["IBM", "AAPL", "TSLA"],
  forex: ["EUR/USD", "GBP/USD", "USD/JPY"],
};

export default function MarketChart() {
  const [mode, setMode] = useState<Mode>("stock");
  const [symbol, setSymbol] = useState("IBM");
  const [data, setData] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    fetch(`/api/market?type=${mode}&symbol=${encodeURIComponent(symbol)}`, {
      signal: ctrl.signal,
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Request failed");
        setData(json.data);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setData([]);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });

    return () => ctrl.abort();
  }, [mode, symbol]);

  const switchMode = (mode: Mode) => {
    setMode(mode);
    setSymbol(PRESETS[mode][0]);
  };

  return (
    <section className="mt-6 rounded-2xl p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl p-1">
          {(["stock", "forex"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-lg px-3 py-1.5 text-sm capitalize transition ${
                mode === m ? "bg-primary text-white" : "hover:bg-sky-50/5 text-muted"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS[mode].map((s) => (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                symbol === s ? "text-primary font-semibold" : "hover:bg-sky-50/5 text-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <h2 className="mb-2 text-lg font-semibold">{symbol} · Daily</h2>

      {loading && <p className="py-20 text-center text-sm opacity-60">Loading…</p>}
      {error && <p className="py-20 text-center text-sm text-red-600">{error}</p>}
      {!loading && !error && <CandlestickChart data={data} />}
    </section>
  );
}