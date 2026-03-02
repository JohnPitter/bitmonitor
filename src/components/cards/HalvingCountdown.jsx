import { useMemo } from "react";
import Card from "../common/Card";
import { getHalvingCountdown } from "../../lib/cycle";
import { HALVINGS } from "../../lib/constants";
import { useTranslation, INTL_LOCALE_MAP } from "../../i18n";

export default function HalvingCountdown() {
  const countdown = useMemo(() => getHalvingCountdown(), []);
  const { t, locale } = useTranslation();
  const intlLocale = INTL_LOCALE_MAP[locale];

  const years = Math.floor(countdown.daysRemaining / 365);
  const months = Math.floor((countdown.daysRemaining % 365) / 30);
  const days = countdown.daysRemaining % 30;

  const estDate = new Date(countdown.date).toLocaleDateString(intlLocale, { month: "long", year: "numeric" });

  return (
    <Card icon="⏳" title={t("halving.title")} subtitle={t("halving.subtitle")}>
      <div className="flex flex-col sm:flex-row sm:gap-6">
        {/* Left: Countdown boxes + estimated date */}
        <div className="flex-1 mb-4 sm:mb-0">
          <div className="flex justify-center sm:justify-start gap-4 mb-3">
            {[
              { value: years, label: t("halving.years") },
              { value: months, label: t("halving.months") },
              { value: days, label: t("halving.days") },
            ].map(({ value, label }) => (
              <div key={label} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 min-w-[64px] text-center">
                <span className="text-2xl font-bold tabular-nums text-btc block">{value}</span>
                <p className="text-[11px] text-text-dim mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-secondary text-center sm:text-left">
            {t("halving.est", { date: estDate })}
          </p>
        </div>

        {/* Right: Reward change + past halvings */}
        <div className="flex-1 space-y-4">
          {/* Reward change */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-text-dim mb-2">{t("halving.rewardAfter")}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary font-medium">{countdown.currentReward} BTC</span>
              <span className="text-btc text-lg">→</span>
              <span className="text-btc font-bold">{countdown.blockRewardAfter} BTC</span>
            </div>
          </div>

          {/* Past halvings */}
          <div>
            <p className="text-xs text-text-dim mb-2 font-medium">{t("halving.previousHalvings")}</p>
            <div className="space-y-1.5">
              {HALVINGS.map((h) => (
                <div key={h.date} className="flex justify-between text-sm text-text-secondary bg-gray-50 rounded-lg px-3 py-1.5">
                  <span>{new Date(h.date).toLocaleDateString(intlLocale, { month: "short", year: "numeric" })}</span>
                  <span className="tabular-nums font-medium">{h.rewardAfter} BTC</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
