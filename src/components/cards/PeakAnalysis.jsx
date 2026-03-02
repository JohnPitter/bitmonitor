import { useMemo } from "react";
import Card from "../common/Card";
import { getPeakAnalysis } from "../../lib/cycle";
import { useTranslation, INTL_LOCALE_MAP } from "../../i18n";

const RISK_COLORS = {
  1: { bg: "bg-green-50", text: "text-green-700", bar: "bg-green-500" },
  2: { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-500" },
  3: { bg: "bg-yellow-50", text: "text-yellow-700", bar: "bg-yellow-500" },
  4: { bg: "bg-red-50", text: "text-red-700", bar: "bg-red-500" },
  5: { bg: "bg-purple-50", text: "text-purple-700", bar: "bg-purple-500" },
};

function formatLocalDate(dateStr, intlLocale) {
  return new Date(dateStr).toLocaleDateString(intlLocale, { day: "numeric", month: "short", year: "numeric" });
}

function formatMonth(dateStr, intlLocale) {
  return new Date(dateStr).toLocaleDateString(intlLocale, { month: "long", year: "numeric" });
}

export default function PeakAnalysis() {
  const { t, locale } = useTranslation();
  const intlLocale = INTL_LOCALE_MAP[locale];
  const analysis = useMemo(() => getPeakAnalysis(), []);

  const { signals, consensus, returns, position, priceProjection } = analysis;
  const risk = RISK_COLORS[position.riskLevel];
  const riskKey = `peak.risk${position.riskLevel}`;

  return (
    <Card icon="🎯" title={t("peak.title")} subtitle={t("peak.subtitle")}>
      <div className="space-y-4">
        {/* Consensus estimate — full width highlight */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
          <p className="text-xs text-text-dim mb-1">{t("peak.consensusEstimate")}</p>
          {position.topAlreadyHappened ? (
            <>
              <p className="text-lg font-bold text-btc">{t("peak.topAlreadyHappened")}</p>
              <p className="text-sm text-text-secondary mt-1">
                {t("peak.nextCyclePeak", { date: formatMonth(consensus.date, intlLocale) })}
              </p>
              <p className="text-xs text-text-dim mt-1">
                {t("peak.daysAgo", { days: position.daysSinceTop })}
              </p>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold text-btc tabular-nums">
                {formatMonth(consensus.date, intlLocale)}
              </span>
              <p className="text-sm text-text-secondary mt-1 tabular-nums">
                {t("peak.inAboutDays", { days: consensus.daysRemaining })}
              </p>
            </>
          )}
        </div>

        {/* Price projection + Risk level — 2 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Price projection */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-text-dim mb-3 font-medium">{t("peak.priceProjection")}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-[11px] text-text-dim mb-1">{t("peak.conservative")}</p>
                <span className="text-xl font-bold text-btc tabular-nums">
                  ${priceProjection.conservative.toLocaleString(intlLocale)}
                </span>
                <p className="text-[10px] text-text-dim mt-1">
                  {t("peak.multiplierLabel", { multiplier: priceProjection.conservativeMultiplier })}
                </p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-[11px] text-text-dim mb-1">{t("peak.optimistic")}</p>
                <span className="text-xl font-bold text-green-700 tabular-nums">
                  ${priceProjection.optimistic.toLocaleString(intlLocale)}
                </span>
                <p className="text-[10px] text-text-dim mt-1">
                  {t("peak.multiplierLabel", { multiplier: priceProjection.optimisticMultiplier })}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {priceProjection.athMultipliers.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] text-text-dim">
                  <span>${m.from.toLocaleString(intlLocale)} → ${m.to.toLocaleString(intlLocale)}</span>
                  <span className="text-btc font-semibold">{m.multiplier}x</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-text-dim mt-2 text-center">
              {t("peak.projectionExplainATH")}
            </p>
          </div>

          {/* Risk level */}
          <div className={`${risk.bg} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-dim">{t("peak.riskLevel")}</span>
              <span className={`text-sm font-bold ${risk.text}`}>{t(riskKey)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${risk.bar}`} style={{ width: `${position.riskLevel * 20}%` }} />
            </div>
          </div>
        </div>

        {/* Signals side-by-side */}
        {!position.topAlreadyHappened && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[11px] text-text-dim mb-1">{t("peak.signalCycle")}</p>
              <p className="text-sm font-semibold tabular-nums">{formatLocalDate(signals.cyclePattern.date, intlLocale)}</p>
              <p className="text-xs text-text-dim mt-0.5 tabular-nums">
                {signals.cyclePattern.daysRemaining > 0
                  ? t("peak.daysLeft", { days: signals.cyclePattern.daysRemaining })
                  : t("peak.passed")}
              </p>
              <p className="text-[10px] text-text-dim mt-1">{t("peak.basedOnPattern", { days: signals.cyclePattern.bullDays })}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[11px] text-text-dim mb-1">{t("peak.signalHalving")}</p>
              <p className="text-sm font-semibold tabular-nums">{formatLocalDate(signals.halvingBased.date, intlLocale)}</p>
              <p className="text-xs text-text-dim mt-0.5 tabular-nums">
                {signals.halvingBased.daysRemaining > 0
                  ? t("peak.daysLeft", { days: signals.halvingBased.daysRemaining })
                  : t("peak.passed")}
              </p>
              <p className="text-[10px] text-text-dim mt-1">{t("peak.basedOnHalving", { days: signals.halvingBased.avgDays })}</p>
            </div>
          </div>
        )}

        {/* Peak window + position stats in flex-row */}
        {!position.topAlreadyHappened && (
          <div className="flex flex-col sm:flex-row sm:gap-3">
            <div className="bg-gray-50 rounded-xl p-3 flex-1 mb-3 sm:mb-0">
              <p className="text-xs text-text-dim mb-1.5">{t("peak.peakWindow")}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold tabular-nums">{formatLocalDate(signals.window.start, intlLocale)}</span>
                <span className="text-text-dim">→</span>
                <span className="font-semibold tabular-nums">{formatLocalDate(signals.window.end, intlLocale)}</span>
              </div>
              <p className="text-[10px] text-text-dim mt-1">{t("peak.windowExplain", { min: signals.window.minDays, max: signals.window.maxDays })}</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-gray-50 rounded-xl p-3 flex-1">
                <p className="text-xs text-text-dim mb-0.5">{t("peak.daysSinceBottom")}</p>
                <p className="text-sm font-semibold tabular-nums">{position.daysSinceBottom} {t("peak.days")}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex-1">
                <p className="text-xs text-text-dim mb-0.5">{t("peak.daysSinceHalving")}</p>
                <p className="text-sm font-semibold tabular-nums">{position.daysSinceHalving} {t("peak.days")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Position stats (shown when top already happened — no peak window) */}
        {position.topAlreadyHappened && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-text-dim mb-0.5">{t("peak.daysSinceBottom")}</p>
              <p className="text-sm font-semibold tabular-nums">{position.daysSinceBottom} {t("peak.days")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-text-dim mb-0.5">{t("peak.daysSinceHalving")}</p>
              <p className="text-sm font-semibold tabular-nums">{position.daysSinceHalving} {t("peak.days")}</p>
            </div>
          </div>
        )}

        {/* Historical returns — compact */}
        <div>
          <p className="text-xs text-text-dim mb-2 font-medium">{t("peak.historicalReturns")}</p>
          <div className="space-y-1.5">
            {returns.history.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2 text-sm">
                <span className="text-text-secondary truncate max-w-[160px]">{c.label}</span>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-text-dim text-xs">${c.bottomPrice.toLocaleString(intlLocale)} → ${c.topPrice.toLocaleString(intlLocale)}</span>
                  <span className="text-btc font-bold">+{c.returnPct.toLocaleString(intlLocale)}%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-text-dim mt-2 text-center">{t("peak.diminishingNote")}</p>
        </div>
      </div>
    </Card>
  );
}
