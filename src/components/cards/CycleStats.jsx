import { useMemo } from "react";
import Card from "../common/Card";
import { getCycleStats } from "../../lib/cycle";

export default function CycleStats() {
  const stats = useMemo(() => getCycleStats(), []);

  return (
    <Card title="Cycle Statistics" subtitle="Historical pattern analysis">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-border/30 rounded-lg p-2.5 text-center">
            <span className="text-lg font-bold text-bull tabular-nums">{stats.avgBullDays}</span>
            <p className="text-[10px] text-text-dim">Avg bull days</p>
          </div>
          <div className="bg-border/30 rounded-lg p-2.5 text-center">
            <span className="text-lg font-bold text-bear tabular-nums">{stats.avgBearDays}</span>
            <p className="text-[10px] text-text-dim">Avg bear days</p>
          </div>
        </div>

        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-xs text-text-dim">Cycle history</p>
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
