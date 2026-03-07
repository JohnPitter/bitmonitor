import { useMemo } from "react";
import Card from "../common/Card";
import { getPeakAnalysis } from "../../lib/cycle";
import { useTranslation, INTL_LOCALE_MAP } from "../../i18n";

const RISK_COLORS = {
  1: { bg: "bg-bull/10", text: "text-bull", bar: "bg-bull" },
  2: { bg: "bg-cyan-400/10", text: "text-cyan-300", bar: "bg-cyan-400" },
  3: { bg: "bg-btc/10", text: "text-btc", bar: "bg-btc" },
  4: { bg: "bg-bear/10", text: "text-bear", bar: "bg-bear" },
  5: { bg: "bg-white/8", text: "text-text-primary", bar: "bg-white/70" },
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
    <Card icon="⌖" title={t("peak.title")} subtitle={t("peak.subtitle")}>
      <div className="space-y-4">
        <div className="rounded-[24px] border border-btc/18 bg-[linear-gradient(180deg,rgba(197,122,84,0.18),rgba(197,122,84,0.05))] p-5 text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.consensusEstimate")}</p>
          {position.topAlreadyHappened ? (
            <>
              <p className="mt-3 text-lg font-semibold text-btc">{t("peak.topAlreadyHappened")}</p>
              <p className="mt-1 text-sm text-text-secondary">
                {t("peak.nextCyclePeak", { date: formatMonth(consensus.date, intlLocale) })}
              </p>
              <p className="mt-1 text-xs text-text-dim">
                {t("peak.daysAgo", { days: position.daysSinceTop })}
              </p>
            </>
          ) : (
            <>
              <span className="mt-3 block text-4xl font-semibold tracking-[-0.05em] text-btc tabular-nums">
                {formatMonth(consensus.date, intlLocale)}
              </span>
              <p className="mt-2 text-sm text-text-secondary tabular-nums">
                {t("peak.inAboutDays", { days: consensus.daysRemaining })}
              </p>
            </>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-border/70 bg-black/15 p-4">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("peak.priceProjection")}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border/60 bg-white/4 p-3 text-center">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.conservative")}</p>
                <span className="text-xl font-semibold text-btc tabular-nums">
                  ${priceProjection.conservative.toLocaleString(intlLocale)}
                </span>
                <p className="mt-1 text-[10px] text-text-dim">
                  {t("peak.multiplierLabel", { multiplier: priceProjection.conservativeMultiplier })}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-white/4 p-3 text-center">
                <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.optimistic")}</p>
                <span className="text-xl font-semibold text-bull tabular-nums">
                  ${priceProjection.optimistic.toLocaleString(intlLocale)}
                </span>
                <p className="mt-1 text-[10px] text-text-dim">
                  {t("peak.multiplierLabel", { multiplier: priceProjection.optimisticMultiplier })}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {priceProjection.athMultipliers.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] text-text-dim">
                  <span>${m.from.toLocaleString(intlLocale)} → ${m.to.toLocaleString(intlLocale)}</span>
                  <span className="font-semibold text-btc">{m.multiplier}x</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-[10px] text-text-dim">
              {t("peak.projectionExplainATH")}
            </p>
          </div>

          <div className={`rounded-[24px] border border-border/70 p-4 ${risk.bg}`}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.riskLevel")}</span>
              <span className={`text-sm font-semibold ${risk.text}`}>{t(riskKey)}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/20">
              <div className={`h-full rounded-full ${risk.bar}`} style={{ width: `${position.riskLevel * 20}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border/60 bg-black/15 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.daysSinceBottom")}</p>
                <p className="mt-2 text-sm font-semibold tabular-nums text-text-primary">{position.daysSinceBottom} {t("peak.days")}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-black/15 p-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.daysSinceHalving")}</p>
                <p className="mt-2 text-sm font-semibold tabular-nums text-text-primary">{position.daysSinceHalving} {t("peak.days")}</p>
              </div>
            </div>
          </div>
        </div>

        {!position.topAlreadyHappened && (
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-white/4 p-4">
              <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.signalCycle")}</p>
              <p className="text-sm font-semibold tabular-nums text-text-primary">{formatLocalDate(signals.cyclePattern.date, intlLocale)}</p>
              <p className="mt-1 text-xs text-text-dim tabular-nums">
                {signals.cyclePattern.daysRemaining > 0
                  ? t("peak.daysLeft", { days: signals.cyclePattern.daysRemaining })
                  : t("peak.passed")}
              </p>
              <p className="mt-2 text-[10px] text-text-dim">{t("peak.basedOnPattern", { days: signals.cyclePattern.bullDays })}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-white/4 p-4">
              <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.signalHalving")}</p>
              <p className="text-sm font-semibold tabular-nums text-text-primary">{formatLocalDate(signals.halvingBased.date, intlLocale)}</p>
              <p className="mt-1 text-xs text-text-dim tabular-nums">
                {signals.halvingBased.daysRemaining > 0
                  ? t("peak.daysLeft", { days: signals.halvingBased.daysRemaining })
                  : t("peak.passed")}
              </p>
              <p className="mt-2 text-[10px] text-text-dim">{t("peak.basedOnHalving", { days: signals.halvingBased.avgDays })}</p>
            </div>
          </div>
        )}

        {!position.topAlreadyHappened && (
          <div className="rounded-2xl border border-border/60 bg-black/15 p-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.peakWindow")}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold tabular-nums text-text-primary">{formatLocalDate(signals.window.start, intlLocale)}</span>
              <span className="text-text-dim">→</span>
              <span className="font-semibold tabular-nums text-text-primary">{formatLocalDate(signals.window.end, intlLocale)}</span>
            </div>
            <p className="mt-2 text-[10px] text-text-dim">{t("peak.windowExplain", { min: signals.window.minDays, max: signals.window.maxDays })}</p>
          </div>
        )}

        {position.topAlreadyHappened && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/60 bg-white/4 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.daysSinceBottom")}</p>
              <p className="mt-2 text-sm font-semibold tabular-nums text-text-primary">{position.daysSinceBottom} {t("peak.days")}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-white/4 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("peak.daysSinceHalving")}</p>
              <p className="mt-2 text-sm font-semibold tabular-nums text-text-primary">{position.daysSinceHalving} {t("peak.days")}</p>
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("peak.historicalReturns")}</p>
          <div className="space-y-2">
            {returns.history.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/4 px-4 py-3 text-sm">
                <span className="max-w-[160px] truncate text-text-secondary">{c.label}</span>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-xs text-text-dim">${c.bottomPrice.toLocaleString(intlLocale)} → ${c.topPrice.toLocaleString(intlLocale)}</span>
                  <span className="font-semibold text-btc">+{c.returnPct.toLocaleString(intlLocale)}%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-text-dim">{t("peak.diminishingNote")}</p>
        </div>
      </div>
    </Card>
  );
}
