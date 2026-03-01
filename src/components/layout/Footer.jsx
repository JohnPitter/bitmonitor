import { useTranslation } from "../../i18n";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="px-4 py-6 mt-8">
      <div className="max-w-6xl mx-auto text-center space-y-2">
        <p className="text-xs text-text-dim">{t("footer.dataSources")}</p>
        <p className="text-xs text-text-dim">
          <a
            href="https://github.com/JohnPitter/bitmonitor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-btc transition-colors underline underline-offset-2"
          >
            GitHub
          </a>
          {" · "}
          {t("footer.disclaimer")}
        </p>
      </div>
    </footer>
  );
}
