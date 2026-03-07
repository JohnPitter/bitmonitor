import { useMemo } from "react";
import Card from "../common/Card";
import { getATHInfo } from "../../lib/cycle";
import { useTranslation, INTL_LOCALE_MAP } from "../../i18n";

export default function ATHTracker() {
  const info = useMemo(() => getATHInfo(), []);
  const { t, locale } = useTranslation();
  const intlLocale = INTL_LOCALE_MAP[locale];

  const estDate = new Date(info.estimatedNextATHDate).toLocaleDateString(intlLocale, { month: "long", year: "numeric" });

  return (
    <Card icon="◎" title={t("ath.title")} subtitle={t("ath.subtitle")} hint={t("ath.explainer")}>
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-btc/18 bg-[linear-gradient(180deg,rgba(197,122,84,0.18),rgba(197,122,84,0.05))] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("ath.currentATH")}</p>
            <span className="mt-3 block text-4xl font-semibold tracking-[-0.05em] text-btc tabular-nums">
              ${info.currentATH.price.toLocaleString(intlLocale)}
            </span>
            <p className="mt-2 text-sm text-text-secondary">
              {new Date(info.currentATH.date).toLocaleDateString(intlLocale, { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-black/15 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("ath.nextEstimate")}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6 text-lg">↗</span>
              <span className="text-2xl font-semibold tracking-[-0.04em] tabular-nums text-text-primary">
                {info.daysUntilNextATH > 0
                  ? t("ath.inDays", { days: info.daysUntilNextATH })
                  : t("ath.anytime")}
              </span>
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              {t("ath.around", { date: estDate })}
            </p>
            <p className="mt-2 text-[11px] text-text-dim">
              {t("ath.avgDaysAfter", { days: info.avgDaysAfterHalving })}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("ath.history")}</p>
          <div className="space-y-2">
            {info.history.map((a) => (
              <div key={a.cycle} className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/4 px-4 py-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/6 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">#{a.cycle}</span>
                  <span className="text-text-secondary">
                    {new Date(a.date).toLocaleDateString(intlLocale, { month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-btc tabular-nums">${a.price.toLocaleString(intlLocale)}</span>
                  <span className="text-xs text-text-dim tabular-nums">{a.daysAfterHalving}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
