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
 * Fetch last 365 days of Bitcoin price from CoinGecko (free tier limit).
 * Returns array of [timestamp, price] pairs (daily).
 */
export async function fetchPriceHistory() {
  const cacheKey = "btc_price_history";
  const cached = getCached(cacheKey, CACHE_TTL_HISTORY);
  if (cached) return cached;

  const url = `${COINGECKO_BASE}/coins/bitcoin/market_chart?vs_currency=usd&days=365`;
  const data = await fetchJSON(url);
  const prices = data.prices;

  setCache(cacheKey, prices);
  return prices;
}

/**
 * Fetch current Bitcoin price in multiple currencies.
 */
export async function fetchCurrentPrice() {
  const cacheKey = "btc_current_price_multi";
  const cached = getCached(cacheKey, CACHE_TTL_PRICE);
  if (cached) return cached;

  const currencies = "usd,brl,eur,cny,jpy";
  const url = `${COINGECKO_BASE}/simple/price?ids=bitcoin&vs_currencies=${currencies}&include_24hr_change=true`;
  const data = await fetchJSON(url);
  const btc = data.bitcoin;

  const result = {
    usd: { price: btc.usd, change24h: btc.usd_24h_change },
    brl: { price: btc.brl, change24h: btc.brl_24h_change },
    eur: { price: btc.eur, change24h: btc.eur_24h_change },
    cny: { price: btc.cny, change24h: btc.cny_24h_change },
    jpy: { price: btc.jpy, change24h: btc.jpy_24h_change },
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
