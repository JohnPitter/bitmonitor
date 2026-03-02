import { useTranslation, INTL_LOCALE_MAP, LOCALE_CURRENCY } from "../../i18n";
import LanguageSelector from "./LanguageSelector";

export default function Header({ currentPrice }) {
  const { t, locale } = useTranslation();
  const intlLocale = INTL_LOCALE_MAP[locale];
  const currency = LOCALE_CURRENCY[locale];

  const priceData = currentPrice?.[currency.code];
  const price = priceData?.price;
  const change = priceData?.change24h;
  const isPositive = change > 0;

  return (
    <header>
      {/* Top nav bar */}
      <div className="bg-white border-b border-border px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center">
              <span className="text-white text-lg font-bold">₿</span>
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">BitMonitor</h1>
              <span className="text-xs text-text-dim">{t("header.subtitle")}</span>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </div>

      {/* Hero section */}
      {price != null && (
        <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-white px-4 py-6 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                Live
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight text-gray-900">
                {price.toLocaleString(intlLocale, { style: "currency", currency: currency.intl, maximumFractionDigits: 0 })}
              </span>
              {change != null && (
                <span className={`text-base font-semibold tabular-nums px-3 py-1 rounded-full ${isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}>
                  {isPositive ? "+" : ""}{change.toFixed(1)}%
                </span>
              )}
            </div>
            <p className="text-sm text-text-dim mt-2">{t("header.last24h")}</p>
          </div>
        </div>
      )}
    </header>
  );
}
