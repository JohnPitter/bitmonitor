import { useMemo } from "react";
import Card from "../common/Card";
import { bestDayOfWeek, bestDayOfMonth } from "../../lib/statistics";
import { useTranslation } from "../../i18n";

export default function BestDays({ priceHistory }) {
  const { t } = useTranslation();

  const weekData = useMemo(
    () => (priceHistory ? bestDayOfWeek(priceHistory) : []),
    [priceHistory],
  );
  const monthData = useMemo(
    () => (priceHistory ? bestDayOfMonth(priceHistory).slice(0, 5) : []),
    [priceHistory],
  );
  const weekByCalendar = useMemo(
    () => [...weekData].sort((a, b) => a.day - b.day),
    [weekData],
  );

  const bestWeek = weekData[0];
  const bestMonth = monthData[0];
  const scale = Math.max(...weekData.map((item) => Math.abs(item.avgReturn)), 0.01);

  return (
    <Card
      icon="7D"
      iconClassName="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-btc"
      title={t("bestDays.title")}
      subtitle={t("bestDays.subtitle")}
      hint={t("bestDays.explainer")}
    >
      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-bull/20 bg-[linear-gradient(180deg,rgba(87,214,141,0.16),rgba(87,214,141,0.05))] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("bestDays.bestWeekday")}</p>
              <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-bull">
                {bestWeek ? t(`dayNames.${bestWeek.label}`) : "—"}
              </p>
              {bestWeek && (
                <>
                  <p className="mt-2 text-sm font-semibold tabular-nums text-bull">
                    {t("bestDays.avgReturnValue", { value: `${bestWeek.avgReturn.toFixed(2)}%` })}
                  </p>
                  <p className="mt-2 text-[11px] text-text-dim">{t("bestDays.samples", { count: bestWeek.samples })}</p>
                </>
              )}
            </div>

            <div className="rounded-[24px] border border-border/70 bg-black/15 p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("bestDays.bestMonthDay")}</p>
              <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-text-primary">
                {bestMonth ? t("bestDays.day", { number: bestMonth.day }) : "—"}
              </p>
              {bestMonth && (
                <>
                  <p className="mt-2 text-sm font-semibold tabular-nums text-text-primary">
                    {t("bestDays.avgReturnValue", { value: `${bestMonth.avgReturn.toFixed(3)}%` })}
                  </p>
                  <p className="mt-2 text-[11px] text-text-dim">{t("bestDays.samples", { count: bestMonth.samples })}</p>
                </>
              )}
            </div>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-black/15 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("bestDays.byDayOfWeek")}</p>
              <span className="rounded-full border border-bull/20 bg-bull/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-bull">
                {t("bestDays.lowerIsBetter")}
              </span>
            </div>

            <div className="space-y-3">
              {weekByCalendar.map((day) => {
                const isBest = day.day === bestWeek?.day;
                const width = Math.max(10, Math.round((Math.abs(day.avgReturn) / scale) * 100));
                const barClass = isBest
                  ? "bg-[linear-gradient(90deg,rgba(87,214,141,0.35),rgba(87,214,141,1))]"
                  : day.avgReturn <= 0
                    ? "bg-[linear-gradient(90deg,rgba(197,122,84,0.22),rgba(197,122,84,0.78))]"
                    : "bg-[linear-gradient(90deg,rgba(255,255,255,0.12),rgba(255,255,255,0.48))]";

                return (
                  <div key={day.day} className="grid grid-cols-[46px_1fr_auto] items-center gap-3">
                    <span className={`rounded-full px-2 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.18em] ${isBest ? "bg-bull/12 text-bull" : "bg-white/6 text-text-secondary"}`}>
                      {t(`dayNames.${day.label}`)}
                    </span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/6">
                      <div className={`h-full rounded-full ${barClass}`} style={{ width: `${width}%` }} />
                    </div>
                    <span className={`text-xs font-semibold tabular-nums ${isBest ? "text-bull" : "text-text-secondary"}`}>
                      {day.avgReturn.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-border/70 bg-white/4 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("bestDays.bestDaysOfMonth")}</p>
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              {t("bestDays.rankWindow")}
            </span>
          </div>

          <div className="space-y-2.5">
            {monthData.map((day, index) => {
              const isTop = index === 0;
              return (
                <div
                  key={day.day}
                  className={`rounded-[22px] border px-4 py-3.5 ${
                    isTop
                      ? "border-bull/25 bg-[linear-gradient(180deg,rgba(87,214,141,0.16),rgba(87,214,141,0.06))]"
                      : "border-border/60 bg-black/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isTop ? "bg-bull/12 text-bull" : "bg-white/6 text-text-secondary"}`}>
                          #{index + 1}
                        </span>
                        <span className={`text-sm font-semibold ${isTop ? "text-bull" : "text-text-primary"}`}>
                          {t("bestDays.day", { number: day.day })}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] text-text-dim">{t("bestDays.samples", { count: day.samples })}</p>
                    </div>

                    <span className={`text-sm font-semibold tabular-nums ${isTop ? "text-bull" : "text-text-secondary"}`}>
                      {day.avgReturn.toFixed(3)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
