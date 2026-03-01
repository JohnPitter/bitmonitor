import {
  COINGECKO_BASE,
  FEAR_GREED_API,
  CACHE_TTL_HISTORY,
  CACHE_TTL_PRICE,
  CACHE_TTL_FNG,
} from "./constants";

function getCached(key, ttl) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > ttl) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // storage full — ignore
  }
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Fetch Bitcoin price history from CoinGecko.
 * Returns array of [timestamp, price] pairs (daily).
 */
export async function fetchPriceHistory() {
  const cacheKey = "btc_price_history";
  const cached = getCached(cacheKey, CACHE_TTL_HISTORY);
  if (cached) return cached;

  // Fetch from Jan 2013 to now
  const from = Math.floor(new Date("2013-01-01").getTime() / 1000);
  const to = Math.floor(Date.now() / 1000);
  const url = `${COINGECKO_BASE}/coins/bitcoin/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
  const data = await fetchJSON(url);
  const prices = data.prices; // [[ts, price], ...]

  setCache(cacheKey, prices);
  return prices;
}

/**
 * Fetch current Bitcoin price.
 */
export async function fetchCurrentPrice() {
  const cacheKey = "btc_current_price";
  const cached = getCached(cacheKey, CACHE_TTL_PRICE);
  if (cached) return cached;

  const url = `${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currency=usd&include_24hr_change=true`;
  const data = await fetchJSON(url);
  const result = {
    price: data.bitcoin.usd,
    change24h: data.bitcoin.usd_24h_change,
  };

  setCache(cacheKey, result);
  return result;
}

/**
 * Fetch Fear & Greed Index (current + history).
 */
export async function fetchFearGreed() {
  const cacheKey = "btc_fear_greed";
  const cached = getCached(cacheKey, CACHE_TTL_FNG);
  if (cached) return cached;

  const url = `${FEAR_GREED_API}?limit=30`;
  const data = await fetchJSON(url);
  const result = data.data.map((d) => ({
    value: Number(d.value),
    label: d.value_classification,
    timestamp: Number(d.timestamp) * 1000,
  }));

  setCache(cacheKey, result);
  return result;
}
