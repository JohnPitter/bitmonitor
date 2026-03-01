import { useMemo } from "react";
import Card from "../common/Card";
import { getCycleStats } from "../../lib/cycle";
import { useTranslation } from "../../i18n";

export default function CycleStats() {
  const stats = useMemo(() => getCycleStats(), []);
  const { t } = useTranslation();

  return (
    <Card icon="📊" title={t("cycleStats.title")} subtitle={t("cycleStats.subtitle")}>
      <div className="space-y-4">
        {/* Averages */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bull/10 rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-bull tabular-nums">{stats.avgBullDays}</span>
            <p className="text-xs text-text-dim mt-1">{t("cycleStats.avgBullDays")}</p>
          </div>
          <div className="bg-bear/10 rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-bear tabular-nums">{stats.avgBearDays}</span>
            <p className="text-xs text-text-dim mt-1">{t("cycleStats.avgBearDays")}</p>
          </div>
        </div>

        {/* Cycle history */}
        <div>
          <p className="text-xs text-text-dim mb-2 font-medium">{t("cycleStats.cycleHistory")}</p>
          <div className="space-y-2">
            {stats.cycles.map((c) => {
              const ret = ((c.topPrice - c.bottomPrice) / c.bottomPrice) * 100;
              return (
                <div key={c.id} className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-2.5">
                  <span className="text-sm text-text-secondary font-medium truncate max-w-[140px]">{c.label}</span>
                  <div className="flex items-center gap-3 tabular-nums text-sm">
                    <span className="text-bull font-medium">{c.bullDays}d 📈</span>
                    <span className="text-bear font-medium">{c.bearDays ?? "—"}d 📉</span>
                    <span className="text-btc font-bold">+{Math.round(ret)}%</span>
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
