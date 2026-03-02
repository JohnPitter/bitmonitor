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
    <Card icon="🛒" title={t("bestDays.title")} subtitle={t("bestDays.subtitle")}>
      <div className="flex flex-col sm:flex-row sm:gap-6">
        {/* Left: Weekday boxes */}
        <div className="flex-1 mb-4 sm:mb-0">
          <p className="text-xs text-text-dim mb-2 font-medium">{t("bestDays.byDayOfWeek")}</p>
          <div className="flex gap-1.5">
            {weekData.map((d) => {
              const isBest = d.day === bestWeek?.day;
              return (
                <div
                  key={d.day}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs transition-all ${
                    isBest ? "bg-green-100 text-green-700 font-bold ring-1 ring-green-300" : "bg-gray-50 text-text-secondary"
                  }`}
                >
                  <div className="font-medium">{t(`dayNames.${d.label}`)}</div>
                  <div className="tabular-nums mt-0.5 text-[11px]">{d.avgReturn.toFixed(2)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Top 5 days of month */}
        <div className="flex-1">
          <p className="text-xs text-text-dim mb-2 font-medium">{t("bestDays.bestDaysOfMonth")}</p>
          <div className="space-y-1.5">
            {monthData.map((d, i) => (
              <div key={d.day} className={`flex items-center justify-between text-sm px-3 py-2 rounded-xl ${i === 0 ? "bg-green-100 text-green-700 font-semibold" : "bg-gray-50 text-text-secondary"}`}>
                <span>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`} {t("bestDays.day", { number: d.day })}
                </span>
                <span className="tabular-nums text-xs">{d.avgReturn.toFixed(3)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
