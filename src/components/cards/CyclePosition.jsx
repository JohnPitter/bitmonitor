import { useMemo } from "react";
import Card from "../common/Card";
import { getCurrentCyclePosition } from "../../lib/cycle";
import { useTranslation } from "../../i18n";

export default function CyclePosition() {
  const pos = useMemo(() => getCurrentCyclePosition(), []);
  const { t } = useTranslation();

  const isBull = pos.phase === "bull";
  const phaseColor = isBull ? "text-bull" : "text-bear";
  const phaseBg = isBull ? "bg-bull" : "bg-bear";
  const pct = Math.round(pos.progress * 100);

  return (
    <Card title={t("cyclePosition.title")} subtitle={pos.cycle.label}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold uppercase ${phaseColor}`}>
            {isBull ? `▲ ${t("cyclePosition.bullMarket")}` : `▼ ${t("cyclePosition.bearMarket")}`}
          </span>
          <span className="text-2xl font-bold tabular-nums">{pct}%</span>
        </div>

        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${phaseBg}`}
            style={{ width: `${pct}%`, opacity: 0.8 }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-text-dim">{t("cyclePosition.daysInPhase")}</span>
            <p className="font-medium tabular-nums">
              {isBull ? pos.daysSinceBottom : pos.daysSinceTop} / {pos.phaseLength}
            </p>
          </div>
          <div>
            <span className="text-text-dim">{t("cyclePosition.estRemaining")}</span>
            <p className="font-medium tabular-nums">{pos.daysRemaining} {t("cyclePosition.days")}</p>
          </div>
          <div>
            <span className="text-text-dim">{t("cyclePosition.phaseStart")}</span>
            <p className="font-medium">{isBull ? pos.cycle.bottom : pos.cycle.top}</p>
          </div>
          <div>
            <span className="text-text-dim">{t("cyclePosition.estEnd")}</span>
            <p className="font-medium">{pos.estimatedEnd}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
