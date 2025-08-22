"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function TickerSearch({
  onSelect,
  placeholder = "Search stocks (AAPL, TSLA)…",
}: {
  onSelect?: (symbol: string) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<
    { symbol: string; name: string; exchange: string; type: string }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const rtr = useRouter();
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      startTransition(async () => {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setResults(data.results ?? []);
      });
    }, 200);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q]);

  function handlePick(symbol: string) {
    onSelect?.(symbol);
    setResults([]);
    setQ(symbol);
  }

  return (
    <div className="relative w-full">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
      />
      {!!results.length && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-zinc-800 bg-background shadow">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => handlePick(r.symbol)}
              className="block w-full px-3 py-2 text-left hover:bg-accent"
            >
              <div className="text-sm font-medium">
                {r.symbol} • {r.name}
              </div>
              <div className="text-xs opacity-70">
                {r.exchange} • {r.type}
              </div>
            </button>
          ))}
        </div>
      )}
      {isPending && (
        <div className="absolute right-2 top-2 text-xs opacity-60">…</div>
      )}
    </div>
  );
}


