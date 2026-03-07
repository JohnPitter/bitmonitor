import { useMemo, useState } from "react";
import Card from "../common/Card";
import { simulateDCA } from "../../lib/statistics";
import { useTranslation } from "../../i18n";

export default function DCASimulator({ priceHistory }) {
  const [amount, setAmount] = useState(100);
  const [frequency, setFrequency] = useState("weekly");
  const [years, setYears] = useState(4);
  const { t } = useTranslation();

  const result = useMemo(
    () => (priceHistory ? simulateDCA(priceHistory, amount, frequency, years) : null),
    [priceHistory, amount, frequency, years],
  );

  const isProfit = result && result.roi > 0;

  const selectClass = "w-full rounded-2xl border border-border/70 bg-black/15 px-3 py-3 text-sm text-text-primary outline-none transition-colors focus:border-btc";

  return (
    <Card icon="∷" title={t("dca.title")} subtitle={t("dca.subtitle")} hint={t("dca.explainer")}>
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="space-y-3 rounded-[24px] border border-border/70 bg-black/15 p-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("dca.amount")}</label>
            <select value={amount} onChange={(e) => setAmount(Number(e.target.value))} className={selectClass}>
              {[25, 50, 100, 250, 500].map((v) => (
                <option key={v} value={v}>${v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("dca.frequency")}</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={selectClass}>
              <option value="weekly">{t("dca.weekly")}</option>
              <option value="monthly">{t("dca.monthly")}</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-text-dim">{t("dca.period")}</label>
            <select value={years} onChange={(e) => setYears(Number(e.target.value))} className={selectClass}>
              {[1, 2, 3, 4, 5, 8, 10].map((v) => (
                <option key={v} value={v}>{v}y</option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <div className="flex-1 space-y-3">
            <div className={`rounded-[24px] border p-5 text-center ${isProfit ? "border-bull/20 bg-[linear-gradient(180deg,rgba(87,214,141,0.16),rgba(87,214,141,0.05))]" : "border-bear/20 bg-[linear-gradient(180deg,rgba(255,122,107,0.16),rgba(255,122,107,0.05))]"}`}>
              <span className={`text-4xl font-semibold tracking-[-0.05em] tabular-nums ${isProfit ? "text-bull" : "text-bear"}`}>
                {isProfit ? "+" : ""}{result.roi.toFixed(1)}%
              </span>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-text-dim">{t("dca.totalReturn")}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t("dca.invested"), value: `$${result.totalInvested.toLocaleString()}` },
                { label: t("dca.currentValue"), value: `$${Math.round(result.currentValue).toLocaleString()}` },
                { label: t("dca.btcAccumulated"), value: result.totalBtc.toFixed(4) },
                { label: t("dca.purchases"), value: result.purchases },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl border border-border/60 bg-white/4 p-3.5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-text-dim">{label}</p>
                  <p className="mt-2 text-sm font-semibold tabular-nums text-text-primary">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
