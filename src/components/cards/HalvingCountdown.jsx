import { useMemo } from "react";
import Card from "../common/Card";
import { HALVINGS } from "../../lib/constants";
import { getHalvingCountdown } from "../../lib/cycle";
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
    <Card icon="◴" title={t("halving.title")} subtitle={t("halving.subtitle")} hint={t("halving.explainer")}>
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-border/70 bg-black/15 p-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: years, label: t("halving.years") },
              { value: months, label: t("halving.months") },
              { value: days, label: t("halving.days") },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-2xl border border-btc/18 bg-[linear-gradient(180deg,rgba(197,122,84,0.16),rgba(197,122,84,0.04))] px-3 py-4 text-center">
                <span className="block text-3xl font-semibold tracking-[-0.05em] tabular-nums text-btc">{value}</span>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-border/60 bg-white/4 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("halving.est", { date: estDate })}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-border/70 bg-white/4 p-4">
            <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("halving.rewardAfter")}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="rounded-full bg-white/6 px-3 py-2 font-medium text-text-secondary">{countdown.currentReward} BTC</span>
              <span className="text-lg text-btc">→</span>
              <span className="rounded-full bg-btc/10 px-3 py-2 font-semibold text-btc">{countdown.blockRewardAfter} BTC</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("halving.previousHalvings")}</p>
            <div className="space-y-2">
              {HALVINGS.map((h) => (
                <div key={h.date} className="flex justify-between rounded-2xl border border-border/60 bg-black/15 px-4 py-2.5 text-sm text-text-secondary">
                  <span>{new Date(h.date).toLocaleDateString(intlLocale, { month: "short", year: "numeric" })}</span>
                  <span className="font-medium tabular-nums">{h.rewardAfter} BTC</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
