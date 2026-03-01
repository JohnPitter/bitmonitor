import { useTranslation, INTL_LOCALE_MAP } from "../../i18n";
import LanguageSelector from "./LanguageSelector";

export default function Header({ currentPrice }) {
  const { t, locale } = useTranslation();
  const price = currentPrice?.price;
  const change = currentPrice?.change24h;
  const isPositive = change > 0;
  const intlLocale = INTL_LOCALE_MAP[locale];

  return (
    <header className="px-4 py-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-btc/15 flex items-center justify-center">
              <span className="text-btc text-lg font-bold">₿</span>
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">BitMonitor</h1>
              <span className="text-xs text-text-dim">{t("header.subtitle")}</span>
            </div>
          </div>
          <LanguageSelector />
        </div>

        {price != null && (
          <div className="bg-bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-sm text-text-dim mb-1">Bitcoin</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
                ${price.toLocaleString(intlLocale, { maximumFractionDigits: 0 })}
              </span>
              {change != null && (
                <span className={`text-base font-semibold tabular-nums px-3 py-1 rounded-full ${isPositive ? "text-bull bg-bull/10" : "text-bear bg-bear/10"}`}>
                  {isPositive ? "+" : ""}{change.toFixed(1)}%
                </span>
              )}
            </div>
            <p className="text-xs text-text-dim mt-2">{t("header.last24h")}</p>
          </div>
        )}
      </div>
    </header>
  );
}
