import { useTranslation } from "../../i18n";

export default function Loader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-3 border-border border-t-btc rounded-full animate-spin" />
        <p className="mt-4 text-text-secondary text-sm">{t("loader.loading")}</p>
      </div>
    </div>
  );
}
