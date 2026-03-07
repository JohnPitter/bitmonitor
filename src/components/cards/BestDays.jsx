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

  const bestWeek = weekData[0];

  return (
    <Card icon="⊕" title={t("bestDays.title")} subtitle={t("bestDays.subtitle")}>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("bestDays.byDayOfWeek")}</p>
          <div className="grid grid-cols-7 gap-2">
            {weekData.map((d) => {
              const isBest = d.day === bestWeek?.day;
              return (
                <div
                  key={d.day}
                  className={`rounded-2xl px-2 py-3 text-center text-xs transition-all ${
                    isBest
                      ? "border border-bull/25 bg-[linear-gradient(180deg,rgba(87,214,141,0.16),rgba(87,214,141,0.06))] text-bull shadow-[0_12px_30px_rgba(87,214,141,0.08)]"
                      : "border border-border/60 bg-white/4 text-text-secondary"
                  }`}
                >
                  <div className="font-medium">{t(`dayNames.${d.label}`)}</div>
                  <div className="mt-1 tabular-nums text-[11px]">{d.avgReturn.toFixed(2)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("bestDays.bestDaysOfMonth")}</p>
          <div className="space-y-2">
            {monthData.map((d, i) => (
              <div
                key={d.day}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm ${
                  i === 0
                    ? "border border-bull/25 bg-[linear-gradient(180deg,rgba(87,214,141,0.16),rgba(87,214,141,0.06))] font-semibold text-bull"
                    : "border border-border/60 bg-white/4 text-text-secondary"
                }`}
              >
                <span>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`} {t("bestDays.day", { number: d.day })}
                </span>
                <span className="text-xs tabular-nums">{d.avgReturn.toFixed(3)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
