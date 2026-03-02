import { useTranslation } from "../../i18n";

export default function Loader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-btc flex items-center justify-center mx-auto mb-4 animate-bounce">
          <span className="text-white text-2xl font-bold">₿</span>
        </div>
        <div className="inline-block w-8 h-8 border-3 border-border border-t-btc rounded-full animate-spin mb-3" />
        <p className="text-text-secondary text-sm">{t("loader.loading")}</p>
      </div>
    </div>
  );
}
