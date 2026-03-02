import { useState, useMemo } from "react";
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

  const selectClass = "w-full bg-gray-50 text-text-primary text-sm rounded-xl px-3 py-2.5 border border-border focus:border-btc outline-none transition-colors";

  return (
    <Card icon="💰" title={t("dca.title")} subtitle={t("dca.subtitle")}>
      <div className="flex flex-col sm:flex-row sm:gap-6">
        {/* Left: Controls */}
        <div className="space-y-3 sm:min-w-[180px] mb-4 sm:mb-0">
          <div>
            <label className="text-xs text-text-dim block mb-1.5 font-medium">{t("dca.amount")}</label>
            <select value={amount} onChange={(e) => setAmount(Number(e.target.value))} className={selectClass}>
              {[25, 50, 100, 250, 500].map((v) => (
                <option key={v} value={v}>${v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-dim block mb-1.5 font-medium">{t("dca.frequency")}</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={selectClass}>
              <option value="weekly">{t("dca.weekly")}</option>
              <option value="monthly">{t("dca.monthly")}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-text-dim block mb-1.5 font-medium">{t("dca.period")}</label>
            <select value={years} onChange={(e) => setYears(Number(e.target.value))} className={selectClass}>
              {[1, 2, 3, 4, 5, 8, 10].map((v) => (
                <option key={v} value={v}>{v}y</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Results */}
        {result && (
          <div className="flex-1 space-y-3">
            {/* Big result */}
            <div className={`text-center py-4 rounded-2xl ${isProfit ? "bg-green-100" : "bg-red-100"}`}>
              <span className={`text-3xl font-bold tabular-nums ${isProfit ? "text-bull" : "text-bear"}`}>
                {isProfit ? "+" : ""}{result.roi.toFixed(1)}%
              </span>
              <p className="text-xs text-text-dim mt-1">{t("dca.totalReturn")}</p>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: t("dca.invested"), value: `$${result.totalInvested.toLocaleString()}` },
                { label: t("dca.currentValue"), value: `$${Math.round(result.currentValue).toLocaleString()}` },
                { label: t("dca.btcAccumulated"), value: result.totalBtc.toFixed(4) },
                { label: t("dca.purchases"), value: result.purchases },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-text-dim">{label}</p>
                  <p className="text-sm font-semibold tabular-nums mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
