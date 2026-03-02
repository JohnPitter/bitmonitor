import { useTranslation } from "../../i18n";

export default function ErrorState({ message, onRetry }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">{t("error.title")}</h2>
        <p className="text-text-secondary text-sm mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-btc text-white font-medium rounded-full hover:bg-btc/80 transition-colors cursor-pointer"
          >
            {t("error.retry")}
          </button>
        )}
      </div>
    </div>
  );
}
