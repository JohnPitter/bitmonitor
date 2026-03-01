import { useMemo } from "react";
import Card from "../common/Card";
import { getCycleStats } from "../../lib/cycle";
import { useTranslation } from "../../i18n";

export default function CycleStats() {
  const stats = useMemo(() => getCycleStats(), []);
  const { t } = useTranslation();

  return (
    <Card title={t("cycleStats.title")} subtitle={t("cycleStats.subtitle")}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-border/30 rounded-lg p-2.5 text-center">
            <span className="text-lg font-bold text-bull tabular-nums">{stats.avgBullDays}</span>
            <p className="text-[10px] text-text-dim">{t("cycleStats.avgBullDays")}</p>
          </div>
          <div className="bg-border/30 rounded-lg p-2.5 text-center">
            <span className="text-lg font-bold text-bear tabular-nums">{stats.avgBearDays}</span>
            <p className="text-[10px] text-text-dim">{t("cycleStats.avgBearDays")}</p>
          </div>
        </div>

        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-xs text-text-dim">{t("cycleStats.cycleHistory")}</p>
          {stats.cycles.map((c) => {
            const ret = ((c.topPrice - c.bottomPrice) / c.bottomPrice) * 100;
            return (
              <div key={c.id} className="flex items-center justify-between text-xs">
                <span className="text-text-secondary truncate max-w-[120px]">{c.label}</span>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="text-bull">{c.bullDays}d</span>
                  <span className="text-text-dim">/</span>
                  <span className="text-bear">{c.bearDays ?? "—"}d</span>
                  <span className="text-btc text-[10px]">+{Math.round(ret)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
