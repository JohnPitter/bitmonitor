// Bitcoin halving events
export const HALVINGS = [
  { date: "2012-11-28", block: 210000, rewardBefore: 50, rewardAfter: 25 },
  { date: "2016-07-09", block: 420000, rewardBefore: 25, rewardAfter: 12.5 },
  { date: "2020-05-11", block: 630000, rewardBefore: 12.5, rewardAfter: 6.25 },
  { date: "2024-04-19", block: 840000, rewardBefore: 6.25, rewardAfter: 3.125 },
];

// Estimated next halving (~April 2028)
export const NEXT_HALVING_ESTIMATE = "2028-04-15";

// Confirmed cycle events (bottom → top)
export const CYCLE_EVENTS = [
  {
    id: 1,
    label: "Cycle 1 (2011-2013)",
    bottom: "2011-11-18",
    top: "2013-12-04",
    bottomPrice: 2,
    topPrice: 1151,
    bullDays: 747,
    bearDays: 406,
  },
  {
    id: 2,
    label: "Cycle 2 (2015-2018)",
    bottom: "2015-01-14",
    top: "2017-12-17",
    bottomPrice: 178,
    topPrice: 19783,
    bullDays: 1067,
    bearDays: 363,
  },
  {
    id: 3,
    label: "Cycle 3 (2018-2022)",
    bottom: "2018-12-15",
    top: "2021-11-10",
    bottomPrice: 3122,
    topPrice: 69044,
    bullDays: 1061,
    bearDays: 376,
  },
  {
    id: 4,
    label: "Cycle 4 (2022-present)",
    bottom: "2022-11-21",
    top: "2025-10-06",
    bottomPrice: 15787,
    topPrice: 126296,
    bullDays: 1050,
    bearDays: null, // in progress
  },
];

// All-Time High history per cycle
export const ATH_HISTORY = [
  { cycle: 1, date: "2013-12-04", price: 1151, daysAfterHalving: 371 },
  { cycle: 2, date: "2017-12-17", price: 19783, daysAfterHalving: 526 },
  { cycle: 3, date: "2021-11-10", price: 69044, daysAfterHalving: 548 },
];

// Pattern averages (cycles 2-4 where pattern holds)
export const PATTERN = {
  avgBullDays: 1059,
  avgBearDays: 370,
  fullCycleDays: 1429,
  claimedBullDays: 1064,
  claimedBearDays: 364,
};

// CoinGecko API
export const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
export const FEAR_GREED_API = "https://api.alternative.me/fng/";

// Cache TTLs
export const CACHE_TTL_HISTORY = 60 * 60 * 1000; // 1 hour
export const CACHE_TTL_PRICE = 15 * 60 * 1000; // 15 minutes
export const CACHE_TTL_FNG = 30 * 60 * 1000; // 30 minutes
