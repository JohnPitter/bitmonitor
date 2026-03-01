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

  return (
    <Card title={t("dca.title")} subtitle={t("dca.subtitle")}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-text-dim uppercase block mb-1">{t("dca.amount")}</label>
            <select
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-border/50 text-text-primary text-xs rounded px-2 py-1.5 border border-border focus:border-btc outline-none"
            >
              {[25, 50, 100, 250, 500].map((v) => (
                <option key={v} value={v}>${v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-text-dim uppercase block mb-1">{t("dca.frequency")}</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-border/50 text-text-primary text-xs rounded px-2 py-1.5 border border-border focus:border-btc outline-none"
            >
              <option value="weekly">{t("dca.weekly")}</option>
              <option value="monthly">{t("dca.monthly")}</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-text-dim uppercase block mb-1">{t("dca.period")}</label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full bg-border/50 text-text-primary text-xs rounded px-2 py-1.5 border border-border focus:border-btc outline-none"
            >
              {[1, 2, 3, 4, 5, 8, 10].map((v) => (
                <option key={v} value={v}>{v}y</option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <div className="space-y-2 border-t border-border pt-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-text-dim">{t("dca.invested")}</span>
                <p className="font-medium tabular-nums">${result.totalInvested.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-text-dim">{t("dca.currentValue")}</span>
                <p className="font-medium tabular-nums">${Math.round(result.currentValue).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-text-dim">{t("dca.btcAccumulated")}</span>
                <p className="font-medium tabular-nums">{result.totalBtc.toFixed(4)}</p>
              </div>
              <div>
                <span className="text-text-dim">{t("dca.purchases")}</span>
                <p className="font-medium tabular-nums">{result.purchases}</p>
              </div>
            </div>
            <div className="text-center pt-1">
              <span className={`text-xl font-bold tabular-nums ${isProfit ? "text-bull" : "text-bear"}`}>
                {isProfit ? "+" : ""}{result.roi.toFixed(1)}%
              </span>
              <p className="text-[10px] text-text-dim">{t("dca.totalReturn")}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
