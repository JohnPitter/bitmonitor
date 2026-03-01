const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Calculate average return by day of week.
 * Returns array of { day, avgReturn, label } sorted by avgReturn (best first).
 */
export function bestDayOfWeek(priceHistory) {
  const dailyReturns = new Map();

  for (let i = 1; i < priceHistory.length; i++) {
    const [ts, price] = priceHistory[i];
    const [, prevPrice] = priceHistory[i - 1];
    const dayOfWeek = new Date(ts).getDay();
    const ret = ((price - prevPrice) / prevPrice) * 100;

    if (!dailyReturns.has(dayOfWeek)) dailyReturns.set(dayOfWeek, []);
    dailyReturns.get(dayOfWeek).push(ret);
  }

  const results = [];
  for (const [day, returns] of dailyReturns) {
    const avg = returns.reduce((s, r) => s + r, 0) / returns.length;
    results.push({
      day,
      label: DAY_NAMES[day],
      avgReturn: avg,
      samples: returns.length,
    });
  }

  return results.sort((a, b) => a.avgReturn - b.avgReturn);
}

/**
 * Calculate average return by day of month.
 * Returns array of { day, avgReturn } sorted by avgReturn (best first).
 */
export function bestDayOfMonth(priceHistory) {
  const dailyReturns = new Map();

  for (let i = 1; i < priceHistory.length; i++) {
    const [ts, price] = priceHistory[i];
    const [, prevPrice] = priceHistory[i - 1];
    const dayOfMonth = new Date(ts).getDate();
    const ret = ((price - prevPrice) / prevPrice) * 100;

    if (!dailyReturns.has(dayOfMonth)) dailyReturns.set(dayOfMonth, []);
    dailyReturns.get(dayOfMonth).push(ret);
  }

  const results = [];
  for (const [day, returns] of dailyReturns) {
    const avg = returns.reduce((s, r) => s + r, 0) / returns.length;
    results.push({
      day,
      label: `Day ${day}`,
      avgReturn: avg,
      samples: returns.length,
    });
  }

  return results.sort((a, b) => a.avgReturn - b.avgReturn);
}

/**
 * Simulate DCA (Dollar Cost Averaging).
 * @param priceHistory - [[ts, price], ...]
 * @param amount - USD per purchase
 * @param frequency - "weekly" or "monthly"
 * @param years - number of years to simulate
 */
export function simulateDCA(priceHistory, amount = 100, frequency = "weekly", years = 4) {
  const now = Date.now();
  const startTs = now - years * 365.25 * 24 * 60 * 60 * 1000;
  const filtered = priceHistory.filter(([ts]) => ts >= startTs);

  if (filtered.length === 0) return null;

  const intervalDays = frequency === "weekly" ? 7 : 30;
  let totalInvested = 0;
  let totalBtc = 0;
  let lastPurchaseDay = -Infinity;
  const history = [];

  for (const [ts, price] of filtered) {
    const daysSinceStart = (ts - filtered[0][0]) / (1000 * 60 * 60 * 24);

    if (daysSinceStart - lastPurchaseDay >= intervalDays) {
      totalInvested += amount;
      totalBtc += amount / price;
      lastPurchaseDay = daysSinceStart;
    }

    const currentValue = totalBtc * price;
    history.push({
      timestamp: ts,
      date: new Date(ts).toISOString().split("T")[0],
      invested: totalInvested,
      value: currentValue,
      btc: totalBtc,
      roi: totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0,
    });
  }

  const lastEntry = history[history.length - 1];

  return {
    totalInvested: lastEntry.invested,
    currentValue: lastEntry.value,
    totalBtc: lastEntry.btc,
    roi: lastEntry.roi,
    purchases: Math.round(totalInvested / amount),
    history,
  };
}
