import { CYCLE_EVENTS, PATTERN, NEXT_HALVING_ESTIMATE, ATH_HISTORY, HALVINGS } from "./constants";
import historicalPrices from "./historical-prices.json";

/**
 * Get the current cycle and position within it.
 */
export function getCurrentCyclePosition() {
  const now = Date.now();
  const currentCycle = CYCLE_EVENTS[CYCLE_EVENTS.length - 1];
  const bottomDate = new Date(currentCycle.bottom).getTime();
  const topDate = new Date(currentCycle.top).getTime();

  const daysSinceBottom = Math.floor((now - bottomDate) / (1000 * 60 * 60 * 24));
  const daysSinceTop = topDate < now ? Math.floor((now - topDate) / (1000 * 60 * 60 * 24)) : 0;

  const isPostTop = now > topDate;

  if (isPostTop) {
    // Bear market phase
    const bearProgress = daysSinceTop / PATTERN.claimedBearDays;
    const estimatedBottomDate = new Date(topDate + PATTERN.claimedBearDays * 24 * 60 * 60 * 1000);
    const daysToBottom = Math.max(0, Math.floor((estimatedBottomDate.getTime() - now) / (1000 * 60 * 60 * 24)));

    return {
      phase: "bear",
      cycle: currentCycle,
      daysSinceBottom,
      daysSinceTop,
      progress: Math.min(1, bearProgress),
      daysRemaining: daysToBottom,
      estimatedEnd: estimatedBottomDate.toISOString().split("T")[0],
      phaseLength: PATTERN.claimedBearDays,
    };
  }

  // Bull market phase
  const bullProgress = daysSinceBottom / PATTERN.claimedBullDays;
  const estimatedTopDate = new Date(bottomDate + PATTERN.claimedBullDays * 24 * 60 * 60 * 1000);
  const daysToTop = Math.max(0, Math.floor((estimatedTopDate.getTime() - now) / (1000 * 60 * 60 * 24)));

  return {
    phase: "bull",
    cycle: currentCycle,
    daysSinceBottom,
    daysSinceTop: 0,
    progress: Math.min(1, bullProgress),
    daysRemaining: daysToTop,
    estimatedEnd: estimatedTopDate.toISOString().split("T")[0],
    phaseLength: PATTERN.claimedBullDays,
  };
}

/**
 * Get cycle stats summary.
 */
export function getCycleStats() {
  const completeCycles = CYCLE_EVENTS.filter((c) => c.bearDays !== null);
  const avgBull = completeCycles.reduce((s, c) => s + c.bullDays, 0) / completeCycles.length;
  const avgBear = completeCycles.reduce((s, c) => s + c.bearDays, 0) / completeCycles.length;
  const avgReturn = completeCycles.reduce((s, c) => s + ((c.topPrice - c.bottomPrice) / c.bottomPrice) * 100, 0) / completeCycles.length;
  const avgDrawdown = completeCycles.slice(1).reduce((s, c, i) => {
    const prevTop = completeCycles[i].topPrice;
    return s + ((c.bottomPrice - prevTop) / prevTop) * 100;
  }, 0) / (completeCycles.length - 1);

  return {
    avgBullDays: Math.round(avgBull),
    avgBearDays: Math.round(avgBear),
    avgReturn: Math.round(avgReturn),
    avgDrawdown: Math.round(avgDrawdown),
    cycles: CYCLE_EVENTS,
  };
}

/**
 * Get halving countdown info.
 */
export function getHalvingCountdown() {
  const nextHalving = new Date(NEXT_HALVING_ESTIMATE).getTime();
  const now = Date.now();
  const daysRemaining = Math.max(0, Math.floor((nextHalving - now) / (1000 * 60 * 60 * 24)));

  return {
    date: NEXT_HALVING_ESTIMATE,
    daysRemaining,
    blockRewardAfter: 1.5625,
    currentReward: 3.125,
  };
}

/**
 * Get ATH (All-Time High) info and estimate for next cycle.
 */
export function getATHInfo() {
  const now = Date.now();

  // Average days after halving that ATH occurs (cycles 2+ are more relevant)
  const recentATHs = ATH_HISTORY.filter((a) => a.cycle >= 2);
  const avgDaysAfterHalving = Math.round(recentATHs.reduce((s, a) => s + a.daysAfterHalving, 0) / recentATHs.length);

  // Current ATH is the highest price across all cycles
  const currentATH = ATH_HISTORY.reduce((best, a) => a.price > best.price ? a : best, ATH_HISTORY[0]);

  // Check if this cycle's ATH already happened — if so, estimate for next halving
  const lastHalving = HALVINGS[HALVINGS.length - 1];
  const lastHalvingTs = new Date(lastHalving.date).getTime();
  const currentCycleEstTs = lastHalvingTs + avgDaysAfterHalving * 24 * 60 * 60 * 1000;

  // If the current cycle estimate is in the past, project from next halving
  const nextHalvingTs = new Date(NEXT_HALVING_ESTIMATE).getTime();
  const useNextCycle = currentCycleEstTs < now;
  const baseHalvingTs = useNextCycle ? nextHalvingTs : lastHalvingTs;

  const estimatedNextATHTs = baseHalvingTs + avgDaysAfterHalving * 24 * 60 * 60 * 1000;
  const estimatedNextATHDate = new Date(estimatedNextATHTs).toISOString().split("T")[0];
  const daysUntilNextATH = Math.max(0, Math.floor((estimatedNextATHTs - now) / (1000 * 60 * 60 * 24)));

  return {
    currentATH,
    history: ATH_HISTORY,
    avgDaysAfterHalving,
    estimatedNextATHDate,
    daysUntilNextATH,
    lastHalvingDate: lastHalving.date,
  };
}

/**
 * Normalize price data for cycle overlay.
 * Uses bundled historical data + live data for the current cycle.
 * Each cycle starts at day 0 with price = 1.0 (normalized).
 */
export function normalizeCycleForOverlay(livePrices) {
  // Merge historical + live data, deduplicating by keeping live data for recent dates
  const allPrices = [...historicalPrices];
  if (livePrices) {
    const lastHistorical = historicalPrices.length > 0 ? historicalPrices[historicalPrices.length - 1][0] : 0;
    for (const point of livePrices) {
      if (point[0] > lastHistorical) allPrices.push(point);
    }
  }

  const overlays = [];

  for (const cycle of CYCLE_EVENTS) {
    const bottomTs = new Date(cycle.bottom).getTime();
    const endTs = cycle.bearDays !== null
      ? bottomTs + (cycle.bullDays + cycle.bearDays) * 24 * 60 * 60 * 1000
      : Date.now();

    const cycleData = allPrices
      .filter(([ts]) => ts >= bottomTs && ts <= endTs)
      .map(([ts, price]) => ({
        day: Math.floor((ts - bottomTs) / (1000 * 60 * 60 * 24)),
        timestamp: ts,
        price,
        normalized: price / cycle.bottomPrice,
      }));

    overlays.push({
      ...cycle,
      data: cycleData,
    });
  }

  return overlays;
}
