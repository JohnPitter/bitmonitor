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
  const bestMonth = monthData[0];

  return (
    <Card title={t("bestDays.title")} subtitle={t("bestDays.subtitle")}>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-text-dim mb-1.5">{t("bestDays.byDayOfWeek")}</p>
          <div className="flex gap-1">
            {weekData.map((d) => {
              const isBest = d.day === bestWeek?.day;
              return (
                <div
                  key={d.day}
                  className={`flex-1 text-center py-1.5 rounded text-xs ${
                    isBest ? "bg-bull/20 text-bull font-semibold" : "bg-border/50 text-text-secondary"
                  }`}
                >
                  <div>{t(`dayNames.${d.label}`)}</div>
                  <div className="tabular-nums">{d.avgReturn.toFixed(2)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs text-text-dim mb-1.5">{t("bestDays.bestDaysOfMonth")}</p>
          <div className="space-y-1">
            {monthData.map((d, i) => (
              <div key={d.day} className="flex items-center justify-between text-xs">
                <span className={i === 0 ? "text-bull font-medium" : "text-text-secondary"}>
                  {i === 0 ? "★" : `${i + 1}.`} {t("bestDays.day", { number: d.day })}
                </span>
                <span className="tabular-nums text-text-secondary">{d.avgReturn.toFixed(3)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
