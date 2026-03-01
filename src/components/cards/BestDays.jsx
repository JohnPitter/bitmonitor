import { useMemo } from "react";
import Card from "../common/Card";
import { bestDayOfWeek, bestDayOfMonth } from "../../lib/statistics";

export default function BestDays({ priceHistory }) {
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
    <Card title="Best Days to Buy" subtitle="Statistical avg. returns (lower = cheaper)">
      <div className="space-y-3">
        {/* Weekly */}
        <div>
          <p className="text-xs text-text-dim mb-1.5">By day of week</p>
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
                  <div>{d.label}</div>
                  <div className="tabular-nums">{d.avgReturn.toFixed(2)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly top 5 */}
        <div>
          <p className="text-xs text-text-dim mb-1.5">Best days of month</p>
          <div className="space-y-1">
            {monthData.map((d, i) => (
              <div key={d.day} className="flex items-center justify-between text-xs">
                <span className={i === 0 ? "text-bull font-medium" : "text-text-secondary"}>
                  {i === 0 ? "★" : `${i + 1}.`} Day {d.day}
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
