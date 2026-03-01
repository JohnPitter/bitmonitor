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
    <Card icon="🏆" title={t("ath.title")} subtitle={t("ath.subtitle")}>
      <div className="space-y-4">
        {/* Current ATH */}
        <div className="bg-btc/10 rounded-2xl p-4 text-center">
          <p className="text-xs text-text-dim mb-1">{t("ath.currentATH")}</p>
          <span className="text-3xl font-bold text-btc tabular-nums">
            ${info.currentATH.price.toLocaleString(intlLocale)}
          </span>
          <p className="text-sm text-text-secondary mt-1">
            {new Date(info.currentATH.date).toLocaleDateString(intlLocale, { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        {/* Next ATH estimate */}
        <div className="bg-white/3 rounded-xl p-4 text-center">
          <p className="text-xs text-text-dim mb-1">{t("ath.nextEstimate")}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="text-xl font-bold tabular-nums">
              {info.daysUntilNextATH > 0
                ? t("ath.inDays", { days: info.daysUntilNextATH })
                : t("ath.anytime")}
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            {t("ath.around", { date: estDate })}
          </p>
          <p className="text-[11px] text-text-dim mt-1">
            {t("ath.avgDaysAfter", { days: info.avgDaysAfterHalving })}
          </p>
        </div>

        {/* ATH history */}
        <div>
          <p className="text-xs text-text-dim mb-2 font-medium">{t("ath.history")}</p>
          <div className="space-y-1.5">
            {info.history.map((a) => (
              <div key={a.cycle} className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-text-dim">#{a.cycle}</span>
                  <span className="text-text-secondary">
                    {new Date(a.date).toLocaleDateString(intlLocale, { month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-btc font-bold tabular-nums">${a.price.toLocaleString(intlLocale)}</span>
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
