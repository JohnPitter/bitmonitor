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
    <Card title={t("halving.title")} subtitle={t("halving.subtitle")}>
      <div className="space-y-3">
        <div className="text-center">
          <div className="flex justify-center gap-3 mb-2">
            {[
              { value: years, label: t("halving.years") },
              { value: months, label: t("halving.months") },
              { value: days, label: t("halving.days") },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <span className="text-2xl font-bold tabular-nums text-btc">{value}</span>
                <p className="text-[10px] text-text-dim uppercase">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary">
            {t("halving.est", { date: estDate })}
          </p>
        </div>

        <div className="border-t border-border pt-3 space-y-1.5">
          <p className="text-xs text-text-dim">{t("halving.rewardAfter")}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">{countdown.currentReward} BTC</span>
            <span className="text-text-dim">→</span>
            <span className="text-btc font-medium">{countdown.blockRewardAfter} BTC</span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-xs text-text-dim mb-1.5">{t("halving.previousHalvings")}</p>
          <div className="space-y-1">
            {HALVINGS.map((h) => (
              <div key={h.date} className="flex justify-between text-xs text-text-secondary">
                <span>{new Date(h.date).toLocaleDateString(intlLocale, { month: "short", year: "numeric" })}</span>
                <span className="tabular-nums">{h.rewardAfter} BTC</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
