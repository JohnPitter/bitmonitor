import { useMemo } from "react";
import Card from "../common/Card";
import { getCycleStats } from "../../lib/cycle";
import { useTranslation } from "../../i18n";

export default function CycleStats() {
  const stats = useMemo(() => getCycleStats(), []);
  const { t } = useTranslation();

  return (
    <Card icon="∿" title={t("cycleStats.title")} subtitle={t("cycleStats.subtitle")}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-bull/20 bg-[linear-gradient(180deg,rgba(87,214,141,0.14),rgba(87,214,141,0.05))] p-4 text-center">
            <span className="text-3xl font-semibold tracking-[-0.05em] text-bull tabular-nums">{stats.avgBullDays}</span>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("cycleStats.avgBullDays")}</p>
          </div>
          <div className="rounded-[22px] border border-bear/20 bg-[linear-gradient(180deg,rgba(255,122,107,0.14),rgba(255,122,107,0.05))] p-4 text-center">
            <span className="text-3xl font-semibold tracking-[-0.05em] text-bear tabular-nums">{stats.avgBearDays}</span>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("cycleStats.avgBearDays")}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("cycleStats.cycleHistory")}</p>
          <div className="space-y-2">
            {stats.cycles.map((c) => {
              const ret = ((c.topPrice - c.bottomPrice) / c.bottomPrice) * 100;
              return (
                <div key={c.id} className="rounded-2xl border border-border/60 bg-white/4 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-text-secondary">{c.label}</span>
                    <span className="text-sm font-semibold text-btc tabular-nums">+{Math.round(ret)}%</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm tabular-nums sm:grid-cols-3">
                    <span className="rounded-xl bg-bull/10 px-3 py-2 text-center font-medium text-bull">{c.bullDays}d</span>
                    <span className="rounded-xl bg-bear/10 px-3 py-2 text-center font-medium text-bear">{c.bearDays ?? "—"}d</span>
                    <span className="hidden rounded-xl bg-white/6 px-3 py-2 text-center text-text-secondary sm:block">
                      ${Math.round(c.topPrice).toLocaleString()}
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
