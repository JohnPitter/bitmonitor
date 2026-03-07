import { useTranslation, INTL_LOCALE_MAP, LOCALE_CURRENCY } from "../../i18n";
import BrandMark from "../branding/BrandMark";
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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(4,9,14,0.74)] px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <BrandMark size={44} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-xl font-semibold tracking-[-0.04em] text-text-primary sm:text-2xl">
                Cycle Atlas
              </h1>
              <span className="hidden rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-text-secondary md:inline-flex">
                {t("header.status")}
              </span>
            </div>
            <p className="truncate text-sm text-text-secondary">
              {t("header.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {price != null && (
            <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 lg:flex">
              <div>
                <p className="text-[0.64rem] uppercase tracking-[0.2em] text-text-dim">{t("header.last24h")}</p>
                <p className="font-display text-xl font-semibold tracking-[-0.04em] text-text-primary">
                  {price.toLocaleString(intlLocale, {
                    style: "currency",
                    currency: currency.intl,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>

              {change != null && (
                <span className={`rounded-full px-2.5 py-1 text-sm font-semibold ${isPositive ? "bg-bull/12 text-bull" : "bg-bear/12 text-bear"}`}>
                  {isPositive ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
              )}

              <span className={`h-2.5 w-2.5 rounded-full ${isPositive ? "bg-bull" : "bg-bear"} shadow-[0_0_14px_currentColor]`} />
            </div>
          )}

          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
