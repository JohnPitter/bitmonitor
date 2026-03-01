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
      try {
        const [priceHistory, currentPrice, fearGreed] = await Promise.all([
          fetchPriceHistory(),
          fetchCurrentPrice(),
          fetchFearGreed(),
        ]);

        if (!cancelled) {
          setData({ priceHistory, currentPrice, fearGreed, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setData((prev) => ({ ...prev, loading: false, error: err.message }));
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return data;
}
