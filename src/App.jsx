import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Loader from "./components/common/Loader";
import ErrorState from "./components/common/ErrorState";
import CycleOverlay from "./components/charts/CycleOverlay";
import CyclePosition from "./components/cards/CyclePosition";
import BestDays from "./components/cards/BestDays";
import FearGreed from "./components/cards/FearGreed";
import HalvingCountdown from "./components/cards/HalvingCountdown";
import DCASimulator from "./components/cards/DCASimulator";
import CycleStats from "./components/cards/CycleStats";
import ATHTracker from "./components/cards/ATHTracker";
import PeakAnalysis from "./components/cards/PeakAnalysis";
import BrandMark from "./components/branding/BrandMark";
import { useBitcoinData } from "./hooks/useBitcoinData";
import { useTranslation, INTL_LOCALE_MAP, LOCALE_CURRENCY } from "./i18n";
import { getCurrentCyclePosition, getHalvingCountdown } from "./lib/cycle";
import historicalPrices from "./lib/historical-prices.json";

function getMoodKey(value) {
  if (value <= 25) return "fearGreed.extremeFear";
  if (value <= 45) return "fearGreed.fear";
  if (value <= 55) return "fearGreed.neutral";
  if (value <= 75) return "fearGreed.greed";
  return "fearGreed.extremeGreed";
}

function formatMonthYear(value, intlLocale) {
  return new Date(value).toLocaleDateString(intlLocale, {
    month: "short",
    year: "numeric",
  });
}

export default function App() {
  const { priceHistory, currentPrice, fearGreed, loading, error } = useBitcoinData();
  const { t, locale } = useTranslation();

  if (loading) return <Loader />;
  if (error) return <ErrorState message={t("error.allFailed")} onRetry={() => window.location.reload()} />;

  const prices = priceHistory || historicalPrices;
  const intlLocale = INTL_LOCALE_MAP[locale];
  const currency = LOCALE_CURRENCY[locale];
  const livePrice = currentPrice?.[currency.code];
  const position = getCurrentCyclePosition();
  const halving = getHalvingCountdown();
  const mood = fearGreed?.[0];
  const phaseKey = position.phase === "bull" ? "cyclePosition.bullMarket" : "cyclePosition.bearMarket";
  const priceLabel = livePrice?.price != null
    ? livePrice.price.toLocaleString(intlLocale, {
        style: "currency",
        currency: currency.intl,
        maximumFractionDigits: 0,
      })
    : "—";
  const changeValue = livePrice?.change24h;
  const changePositive = changeValue > 0;
  const progressPct = Math.round(position.progress * 100);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header currentPrice={currentPrice} />

      <main className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(140deg,rgba(10,23,31,0.96),rgba(6,13,18,0.92))] px-6 py-7 shadow-[0_40px_120px_-56px_rgba(0,0,0,0.95)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(98,216,182,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(213,138,62,0.22),transparent_30%),linear-gradient(120deg,transparent,rgba(255,255,255,0.02),transparent)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                <span className="h-2 w-2 rounded-full bg-bull shadow-[0_0_14px_rgba(98,216,182,0.9)]" />
                {t("header.status")}
              </span>

              <div className="space-y-5">
                <BrandMark size={52} withWordmark descriptor={t("header.subtitle")} />
                <div className="space-y-3">
                  <p className="font-display text-sm uppercase tracking-[0.28em] text-btc">
                    {t("hero.eyebrow")}
                  </p>
                  <h2 className="max-w-4xl font-display text-4xl font-semibold tracking-[-0.05em] text-text-primary sm:text-5xl lg:text-6xl">
                    {t("hero.title")}
                  </h2>
                  <p className="max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                    {t("hero.description")}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-text-dim">{t("header.last24h")}</p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                    {priceLabel}
                  </p>
                  <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${changePositive ? "bg-bull/12 text-bull" : "bg-bear/12 text-bear"}`}>
                    {changeValue != null ? `${changePositive ? "+" : ""}${changeValue.toFixed(1)}%` : "—"}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-text-dim">{t("fearGreed.title")}</p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                    {mood?.value ?? "—"}
                  </p>
                  <p className="mt-2 text-sm font-medium text-text-secondary">
                    {mood ? t(getMoodKey(mood.value)) : t("fearGreed.noData")}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.22em] text-text-dim">{t("cyclePosition.title")}</p>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                    {progressPct}%
                  </p>
                  <p className="mt-2 text-sm font-medium text-text-secondary">
                    {t(phaseKey)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative overflow-hidden rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(15,29,39,0.9),rgba(8,15,22,0.92))] p-5 shadow-[0_28px_90px_-48px_rgba(0,0,0,0.95)]">
                <div className="pointer-events-none absolute -right-10 top-[-28px] h-44 w-44 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute right-5 top-5 h-20 w-20 rounded-full border border-btc/30" />
                <div className="pointer-events-none absolute left-6 top-6 h-px w-16 bg-bull/45" />

                <div className="relative space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-text-dim">{t("cycleOverlay.title")}</p>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-text-secondary">
                        {t("cycleOverlay.subtitle")}
                      </p>
                    </div>
                    <span className="rounded-full border border-btc/25 bg-btc/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-btc">
                      {position.cycle.label}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-white/8 bg-black/15 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-text-dim">{t("cyclePosition.title")}</p>
                      <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-text-primary">
                        {t(phaseKey)}
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        {position.daysRemaining} {t("cyclePosition.days")}
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-white/8 bg-black/15 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-text-dim">{t("halving.title")}</p>
                      <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-text-primary">
                        {formatMonthYear(halving.date, intlLocale)}
                      </p>
                      <p className="mt-2 text-sm text-text-secondary">
                        {halving.daysRemaining} {t("halving.days")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: t("cyclePosition.daysInPhase"),
                    value: `${position.phase === "bull" ? position.daysSinceBottom : position.daysSinceTop} / ${position.phaseLength}`,
                  },
                  {
                    label: t("cyclePosition.estEnd"),
                    value: position.estimatedEnd,
                  },
                  {
                    label: t("halving.rewardAfter"),
                    value: `${halving.blockRewardAfter} BTC`,
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-text-dim">{item.label}</p>
                    <p className="mt-3 font-display text-xl font-semibold tracking-[-0.04em] text-text-primary">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-w-0 flex-col gap-4">
          <section className="grid gap-4">
            <CycleOverlay priceHistory={prices} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <CyclePosition />
              <FearGreed fearGreed={fearGreed} />
            </div>
          </section>

          <section className="grid gap-4">
            <PeakAnalysis />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <ATHTracker />
              <HalvingCountdown />
              <CycleStats />
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <BestDays priceHistory={prices} />
            <DCASimulator priceHistory={prices} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
