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
 * Get peak analysis — cross-references multiple signals to estimate
 * when the next major high will occur and the current risk level.
 */
export function getPeakAnalysis() {
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;
  const currentCycle = CYCLE_EVENTS[CYCLE_EVENTS.length - 1];
  const bottomTs = new Date(currentCycle.bottom).getTime();
  const topTs = new Date(currentCycle.top).getTime();
  const isPostTop = now > topTs;

  // --- Signal 1: Cycle pattern (1064d bull) ---
  const patternPeakTs = bottomTs + PATTERN.claimedBullDays * DAY_MS;
  const patternPeakDate = new Date(patternPeakTs).toISOString().split("T")[0];
  const daysToPatternPeak = Math.floor((patternPeakTs - now) / DAY_MS);

  // --- Signal 2: ATH after halving (avg ~537d) ---
  const recentATHs = ATH_HISTORY.filter((a) => a.cycle >= 2);
  const avgDaysAfterHalving = Math.round(recentATHs.reduce((s, a) => s + a.daysAfterHalving, 0) / recentATHs.length);
  const minDaysAfterHalving = Math.min(...recentATHs.map((a) => a.daysAfterHalving));
  const maxDaysAfterHalving = Math.max(...recentATHs.map((a) => a.daysAfterHalving));

  const lastHalving = HALVINGS[HALVINGS.length - 1];
  const lastHalvingTs = new Date(lastHalving.date).getTime();
  const halvingPeakTs = lastHalvingTs + avgDaysAfterHalving * DAY_MS;
  const halvingPeakDate = new Date(halvingPeakTs).toISOString().split("T")[0];
  const daysToHalvingPeak = Math.floor((halvingPeakTs - now) / DAY_MS);

  // Window range (earliest to latest based on historical spread)
  const windowStartTs = lastHalvingTs + minDaysAfterHalving * DAY_MS;
  const windowEndTs = lastHalvingTs + maxDaysAfterHalving * DAY_MS;
  const windowStartDate = new Date(windowStartTs).toISOString().split("T")[0];
  const windowEndDate = new Date(windowEndTs).toISOString().split("T")[0];

  // --- Signal 3: Historical returns from bottom ---
  const cycleReturns = CYCLE_EVENTS.map((c) => ({
    id: c.id,
    label: c.label,
    returnPct: Math.round(((c.topPrice - c.bottomPrice) / c.bottomPrice) * 100),
    bottomPrice: c.bottomPrice,
    topPrice: c.topPrice,
  }));
  const avgReturn = Math.round(cycleReturns.reduce((s, c) => s + c.returnPct, 0) / cycleReturns.length);

  // Diminishing returns trend (each cycle has lower % return)
  const diminishingFactor = cycleReturns.length >= 2
    ? cycleReturns[cycleReturns.length - 1].returnPct / cycleReturns[cycleReturns.length - 2].returnPct
    : 1;

  // --- Current position analysis ---
  const daysSinceBottom = Math.floor((now - bottomTs) / DAY_MS);
  const daysSinceHalving = Math.floor((now - lastHalvingTs) / DAY_MS);

  // Did the top already happen in this cycle?
  const topAlreadyHappened = isPostTop;
  const daysSinceTop = topAlreadyHappened ? Math.floor((now - topTs) / DAY_MS) : 0;

  // --- Convergence: consensus estimate from signals ---
  let consensusPeakTs;
  let consensusConfidence;

  if (topAlreadyHappened) {
    // Top already happened — project next cycle peak
    const nextHalvingTs = new Date(NEXT_HALVING_ESTIMATE).getTime();
    consensusPeakTs = nextHalvingTs + avgDaysAfterHalving * DAY_MS;
    consensusConfidence = "next_cycle";
  } else {
    // Average of the two signals
    consensusPeakTs = Math.round((patternPeakTs + halvingPeakTs) / 2);
    // Confidence based on how close the two signals agree
    const signalDiffDays = Math.abs(daysToPatternPeak - daysToHalvingPeak);
    consensusConfidence = signalDiffDays <= 30 ? "high" : signalDiffDays <= 90 ? "medium" : "low";
  }

  const consensusPeakDate = new Date(consensusPeakTs).toISOString().split("T")[0];
  const daysToConsensusPeak = Math.max(0, Math.floor((consensusPeakTs - now) / DAY_MS));

  // --- Price projection for next cycle ---
  // Historical drawdown from top to next bottom
  const drawdowns = [];
  for (let i = 1; i < CYCLE_EVENTS.length; i++) {
    const prevTop = CYCLE_EVENTS[i - 1].topPrice;
    const nextBottom = CYCLE_EVENTS[i].bottomPrice;
    drawdowns.push((prevTop - nextBottom) / prevTop);
  }
  const avgDrawdownPct = drawdowns.length > 0
    ? drawdowns.reduce((s, d) => s + d, 0) / drawdowns.length
    : 0.80;

  // Use only recent cycles (2+) for diminishing return ratio — cycle 1 is an outlier
  const recentReturns = cycleReturns.filter((c) => c.id >= 2);
  const recentRatios = [];
  for (let i = 1; i < recentReturns.length; i++) {
    if (recentReturns[i - 1].returnPct > 0) {
      recentRatios.push(recentReturns[i].returnPct / recentReturns[i - 1].returnPct);
    }
  }
  // Last ratio is most recent trend; fallback to 0.33
  const lastDiminishingRatio = recentRatios.length > 0
    ? recentRatios[recentRatios.length - 1]
    : 0.33;

  const lastCycleReturn = cycleReturns[cycleReturns.length - 1];
  const projectedReturnPct = Math.round(lastCycleReturn.returnPct * lastDiminishingRatio);

  // Conservative: avg drawdown, diminishing return
  const projectedNextBottomConservative = Math.round(currentCycle.topPrice * (1 - avgDrawdownPct));
  const projectedNextATHConservative = Math.round(projectedNextBottomConservative * (1 + projectedReturnPct / 100));

  // Optimistic: smallest historical drawdown, same return
  const minDrawdown = Math.min(...drawdowns);
  const projectedNextBottomOptimistic = Math.round(currentCycle.topPrice * (1 - minDrawdown));
  const projectedNextATHOptimistic = Math.round(projectedNextBottomOptimistic * (1 + projectedReturnPct / 100));

  const priceProjection = {
    currentTopPrice: currentCycle.topPrice,
    avgDrawdownPct: Math.round(avgDrawdownPct * 100),
    projectedReturnPct,
    conservative: {
      nextBottom: projectedNextBottomConservative,
      nextATH: projectedNextATHConservative,
    },
    optimistic: {
      nextBottom: projectedNextBottomOptimistic,
      nextATH: projectedNextATHOptimistic,
    },
  };

  // --- Risk level (how close to the expected top) ---
  let riskLevel; // 1=low (accumulate), 2=moderate, 3=high (caution), 4=extreme (near top), 5=bear
  if (topAlreadyHappened) {
    riskLevel = 5;
  } else {
    const bullProgress = daysSinceBottom / PATTERN.claimedBullDays;
    if (bullProgress < 0.5) riskLevel = 1;
    else if (bullProgress < 0.75) riskLevel = 2;
    else if (bullProgress < 0.9) riskLevel = 3;
    else riskLevel = 4;
  }

  return {
    // Signals
    signals: {
      cyclePattern: { date: patternPeakDate, daysRemaining: daysToPatternPeak, bullDays: PATTERN.claimedBullDays },
      halvingBased: { date: halvingPeakDate, daysRemaining: daysToHalvingPeak, avgDays: avgDaysAfterHalving },
      window: { start: windowStartDate, end: windowEndDate, minDays: minDaysAfterHalving, maxDays: maxDaysAfterHalving },
    },
    // Consensus
    consensus: { date: consensusPeakDate, daysRemaining: daysToConsensusPeak, confidence: consensusConfidence },
    // Returns
    returns: { history: cycleReturns, avgReturn, diminishingFactor: Math.round(diminishingFactor * 100) / 100 },
    // Price projection
    priceProjection,
    // Position
    position: { daysSinceBottom, daysSinceHalving, daysSinceTop, topAlreadyHappened, riskLevel },
    // Current cycle
    currentCycle,
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
