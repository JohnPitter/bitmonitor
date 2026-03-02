import { useMemo } from "react";
import Card from "../common/Card";
import { getCurrentCyclePosition } from "../../lib/cycle";
import { useTranslation } from "../../i18n";

export default function CyclePosition() {
  const pos = useMemo(() => getCurrentCyclePosition(), []);
  const { t } = useTranslation();

  const isBull = pos.phase === "bull";
  const pct = Math.round(pos.progress * 100);

  return (
    <Card icon={isBull ? "📈" : "📉"} title={t("cyclePosition.title")} subtitle={pos.cycle.label}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
        {/* Left: Phase badge + percentage */}
        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 mb-4 sm:mb-0 sm:min-w-[120px]">
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${isBull ? "text-bull bg-bull/10" : "text-bear bg-bear/10"}`}>
            {isBull ? t("cyclePosition.bullMarket") : t("cyclePosition.bearMarket")}
          </span>
          <span className="text-3xl font-bold tabular-nums">{pct}%</span>
        </div>

        {/* Center: Progress bar */}
        <div className="flex-1 mb-4 sm:mb-0">
          <div className="w-full h-3 bg-bg-highlight rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isBull ? "bg-gradient-to-r from-bull/60 to-bull" : "bg-gradient-to-r from-bear/60 to-bear"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Right: Stats grid 2x2 */}
        <div className="grid grid-cols-2 gap-3 sm:min-w-[260px]">
          {[
            { label: t("cyclePosition.daysInPhase"), value: `${isBull ? pos.daysSinceBottom : pos.daysSinceTop} / ${pos.phaseLength}` },
            { label: t("cyclePosition.estRemaining"), value: `${pos.daysRemaining} ${t("cyclePosition.days")}` },
            { label: t("cyclePosition.phaseStart"), value: isBull ? pos.cycle.bottom : pos.cycle.top },
            { label: t("cyclePosition.estEnd"), value: pos.estimatedEnd },
          ].map(({ label, value }) => (
            <div key={label} className="bg-bg-highlight rounded-xl p-3">
              <p className="text-xs text-text-dim mb-0.5">{label}</p>
              <p className="text-sm font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
