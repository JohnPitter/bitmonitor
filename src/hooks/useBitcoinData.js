import { useState, useEffect } from "react";
import { fetchPriceHistory, fetchCurrentPrice, fetchFearGreed } from "../lib/api";

export function useBitcoinData() {
  const [data, setData] = useState({
    priceHistory: null,
    currentPrice: null,
    fearGreed: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Fetch all in parallel — each one is independent and can fail gracefully
      const [priceResult, priceInfoResult, fngResult] = await Promise.allSettled([
        fetchPriceHistory(),
        fetchCurrentPrice(),
        fetchFearGreed(),
      ]);

      if (cancelled) return;

      const priceHistory = priceResult.status === "fulfilled" ? priceResult.value : null;
      const currentPrice = priceInfoResult.status === "fulfilled" ? priceInfoResult.value : null;
      const fearGreed = fngResult.status === "fulfilled" ? fngResult.value : null;

      // Only error if ALL requests failed
      const allFailed = !priceHistory && !currentPrice && !fearGreed;

      setData({
        priceHistory,
        currentPrice,
        fearGreed,
        loading: false,
        error: allFailed ? "All API requests failed. Try again later." : null,
      });
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return data;
}
