import { useTranslation, INTL_LOCALE_MAP } from "../../i18n";
import LanguageSelector from "./LanguageSelector";

export default function Header({ currentPrice }) {
  const { t, locale } = useTranslation();
  const price = currentPrice?.price;
  const change = currentPrice?.change24h;
  const isPositive = change > 0;
  const intlLocale = INTL_LOCALE_MAP[locale];

  return (
    <header className="border-b border-border px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-btc text-xl font-bold">₿</span>
          <h1 className="text-lg font-semibold">BitMonitor</h1>
          <span className="text-xs text-text-dim hidden sm:inline">{t("header.subtitle")}</span>
        </div>
        <div className="flex items-center gap-3">
          {price != null && (
            <>
              <span className="text-xl font-bold tabular-nums">
                ${price.toLocaleString(intlLocale, { maximumFractionDigits: 0 })}
              </span>
              {change != null && (
                <span className={`text-sm font-medium tabular-nums ${isPositive ? "text-bull" : "text-bear"}`}>
                  {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
                </span>
              )}
            </>
          )}
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
