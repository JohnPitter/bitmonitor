import { useMemo } from "react";
import Card from "../common/Card";
import { getHalvingCountdown } from "../../lib/cycle";
import { HALVINGS } from "../../lib/constants";

export default function HalvingCountdown() {
  const countdown = useMemo(() => getHalvingCountdown(), []);

  const years = Math.floor(countdown.daysRemaining / 365);
  const months = Math.floor((countdown.daysRemaining % 365) / 30);
  const days = countdown.daysRemaining % 30;

  return (
    <Card title="Halving Countdown" subtitle="Next supply reduction event">
      <div className="space-y-3">
        <div className="text-center">
          <div className="flex justify-center gap-3 mb-2">
            {[
              { value: years, label: "years" },
              { value: months, label: "months" },
              { value: days, label: "days" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <span className="text-2xl font-bold tabular-nums text-btc">{value}</span>
                <p className="text-[10px] text-text-dim uppercase">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary">
            Est. {new Date(countdown.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-xs text-text-dim">Reward after halving</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">{countdown.currentReward} BTC</span>
            <span className="text-text-dim">→</span>
            <span className="text-btc font-medium">{countdown.blockRewardAfter} BTC</span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-xs text-text-dim mb-1.5">Previous halvings</p>
          <div className="space-y-1">
            {HALVINGS.map((h) => (
              <div key={h.date} className="flex justify-between text-xs text-text-secondary">
                <span>{new Date(h.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                <span className="tabular-nums">{h.rewardAfter} BTC</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
