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
    <header className="bg-[#0d1321] border-b border-border px-4 py-3 sm:px-6">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left: Logo + name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-btc flex items-center justify-center">
            <span className="text-white text-lg font-bold">₿</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary leading-tight">BitMonitor</h1>
            <span className="text-xs text-text-dim">{t("header.subtitle")}</span>
          </div>
        </div>

        {/* Center: Price + change (inline) */}
        {price != null && (
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-2xl font-bold tabular-nums text-text-primary">
              {price.toLocaleString(intlLocale, { style: "currency", currency: currency.intl, maximumFractionDigits: 0 })}
            </span>
            {change != null && (
              <span className={`text-sm font-semibold tabular-nums px-2.5 py-1 rounded-full ${isPositive ? "text-bull bg-bull/10" : "text-bear bg-bear/10"}`}>
                {isPositive ? "+" : ""}{change.toFixed(1)}%
              </span>
            )}
            <span className="w-2 h-2 bg-bull rounded-full animate-pulse" />
          </div>
        )}

        {/* Right: Language */}
        <LanguageSelector />
      </div>
    </header>
  );
}
