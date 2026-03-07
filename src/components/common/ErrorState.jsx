import BrandMark from "../branding/BrandMark";
import { useTranslation } from "../../i18n";

export default function ErrorState({ message, onRetry }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,20,28,0.94),rgba(7,12,18,0.96))] px-8 py-10 text-center shadow-[0_36px_120px_-56px_rgba(0,0,0,1)]">
        <div className="pointer-events-none absolute inset-0" />
        <div className="mx-auto flex max-w-sm flex-col items-center">
          <BrandMark size={56} />
          <div className="mt-6 rounded-full border border-bear/20 bg-bear/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-bear">
            Cycle Atlas
          </div>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em] text-text-primary">
            {t("error.title")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {message}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-6 rounded-full border border-btc/25 bg-btc/14 px-6 py-3 text-sm font-semibold text-btc transition-colors hover:border-btc/40 hover:bg-btc/20 hover:text-text-primary"
            >
              {t("error.retry")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
