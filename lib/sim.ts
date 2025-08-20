export type Holding = { symbol: string; qty: number; avgPrice: number; };
export type Txn = {
  id: string;
  ts: number;
  type: "BUY" | "SELL" | "SALARY";
  symbol?: string;
  qty?: number;
  price?: number;
  amount: number;
};
export type SimState = {
  user: { name: string };
  balance: number;
  monthlyIncome: number;
  nextPayoutAt: number;
  portfolio: Holding[];
  txns: Txn[];
};

const KEY = "finly-sim-state";

const defaultState = (name = "Player"): SimState => ({
  user: { name },
  balance: 10_000,
  monthlyIncome: 5_000,
  nextPayoutAt: Date.now() + 60 * 60 * 1000,
  portfolio: [],
  txns: [],
});

export function loadState(): SimState {
  if (typeof window === "undefined") return defaultState();
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as SimState) : defaultState();
}

export function saveState(s: SimState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function initUser(name: string) {
  const s = loadState();
  if (!s.user?.name || s.user.name === "Player") {
    const n = { ...defaultState(name) };
    saveState(n);
    return n;
  }
  return s;
}

export function claimSalary(): SimState {
  const s = loadState();
  if (Date.now() >= s.nextPayoutAt) {
    s.balance += s.monthlyIncome;
    s.txns.unshift({
      id: crypto.randomUUID(),
      ts: Date.now(),
      type: "SALARY",
      amount: s.monthlyIncome,
    });
    s.nextPayoutAt = Date.now() + 60 * 60 * 1000;
    saveState(s);
  }
  return s;
}

export function placeOrder(
  type: "BUY" | "SELL",
  symbol: string,
  qty: number,
  price: number
): SimState {
  const s = loadState();
  if (qty <= 0) return s;

  if (type === "BUY") {
    const cost = qty * price;
    if (cost > s.balance) throw new Error("Insufficient balance");
    s.balance -= cost;

    const h = s.portfolio.find((p) => p.symbol === symbol);
    if (h) {
      const totalCost = h.avgPrice * h.qty + cost;
      const newQty = h.qty + qty;
      h.avgPrice = totalCost / newQty;
      h.qty = newQty;
    } else {
      s.portfolio.push({ symbol, qty, avgPrice: price });
    }
    s.txns.unshift({
      id: crypto.randomUUID(),
      ts: Date.now(),
      type: "BUY",
      symbol,
      qty,
      price,
      amount: -cost,
    });
  } else {
    const h = s.portfolio.find((p) => p.symbol === symbol);
    if (!h || h.qty < qty) throw new Error("Not enough shares");
    h.qty -= qty;
    const proceeds = qty * price;
    s.balance += proceeds;
    s.txns.unshift({
      id: crypto.randomUUID(),
      ts: Date.now(),
      type: "SELL",
      symbol,
      qty,
      price,
      amount: proceeds,
    });
    if (h.qty === 0) s.portfolio = s.portfolio.filter((p) => p.symbol !== symbol);
  }

  saveState(s);
  return s;
}
