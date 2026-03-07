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
    <Card icon="◷" title={t("cyclePosition.title")} subtitle={pos.cycle.label}>
      <div className="space-y-4">
        <div className="rounded-[24px] border border-border/70 bg-black/15 p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
            <div className="min-w-[150px]">
              <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] ${isBull ? "bg-bull/12 text-bull" : "bg-bear/12 text-bear"}`}>
                {isBull ? t("cyclePosition.bullMarket") : t("cyclePosition.bearMarket")}
              </span>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-5xl font-semibold tracking-[-0.05em] tabular-nums text-text-primary">{pct}%</span>
                <span className="pb-2 text-xs uppercase tracking-[0.22em] text-text-dim">{pos.cycle.label}</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative mb-5 h-3.5 overflow-hidden rounded-full bg-white/6">
                <div
                  className={`h-full rounded-full transition-all ${isBull ? "bg-[linear-gradient(90deg,rgba(87,214,141,0.35),rgba(87,214,141,1))]" : "bg-[linear-gradient(90deg,rgba(255,122,107,0.35),rgba(255,122,107,1))]"}`}
                  style={{ width: `${pct}%` }}
                />
                <span
                  className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-black/30 shadow-[0_0_24px_rgba(255,255,255,0.18)] ${isBull ? "bg-bull" : "bg-bear"}`}
                  style={{ left: `calc(${pct}% - 10px)` }}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: t("cyclePosition.daysInPhase"), value: `${isBull ? pos.daysSinceBottom : pos.daysSinceTop} / ${pos.phaseLength}` },
                  { label: t("cyclePosition.estRemaining"), value: `${pos.daysRemaining} ${t("cyclePosition.days")}` },
                  { label: t("cyclePosition.phaseStart"), value: isBull ? pos.cycle.bottom : pos.cycle.top },
                  { label: t("cyclePosition.estEnd"), value: pos.estimatedEnd },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl border border-border/60 bg-white/4 p-3.5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{label}</p>
                    <p className="mt-2 text-sm font-semibold tabular-nums text-text-primary">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
