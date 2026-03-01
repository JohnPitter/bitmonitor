# BitMonitor

Bitcoin cycle analysis dashboard built on the empirical ~1064-day bull / ~364-day bear market pattern.

**Live:** [johnpitter.github.io/bitmonitor](https://johnpitter.github.io/bitmonitor/)

## Features

- **Cycle Position** — Where we are in the current bull/bear cycle with progress bar and estimated dates
- **Price vs. Cycle Overlay** — Normalized price chart overlaying all historical cycles (log scale)
- **Best Days to Buy** — Statistical analysis of average returns by day of week and day of month
- **Fear & Greed Index** — Market sentiment gauge with buy/sell signals
- **Halving Countdown** — Next Bitcoin halving with reward history
- **DCA Simulator** — Dollar Cost Averaging backtest with configurable amount, frequency, and period
- **Cycle Statistics** — Historical bull/bear durations and returns

## The 1064/364 Pattern

Bitcoin follows a roughly 4-year cycle tied to the halving (supply reduction every ~210,000 blocks):

| Cycle | Bull (days) | Bear (days) | Return |
|---|---|---|---|
| 2015-2018 | 1,067 | 363 | +11,000% |
| 2018-2022 | 1,061 | 376 | +2,100% |
| 2022-2025 | 1,050 | in progress | +700% |

Pattern popularized by [HornHairs](https://x.com/CryptoHornHairs) (Jan 2023). It's a heuristic guide, not a precise clock.

## Tech Stack

- React 19 + Vite
- Tailwind CSS 4
- Recharts
- CoinGecko API (free, no key)
- Alternative.me Fear & Greed API
- GitHub Pages (auto-deploy via Actions)

## Development

```bash
npm install
npm run dev
```

## Disclaimer

This dashboard is for educational purposes only. Not financial advice. The 1064/364 pattern is an empirical observation with a small sample size and may not hold in future cycles.
