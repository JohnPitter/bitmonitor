import { useTranslation } from "../../i18n";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="px-4 pb-10 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1600px] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,26,0.88),rgba(6,11,16,0.9))] px-5 py-5 shadow-[0_26px_80px_-44px_rgba(0,0,0,0.9)] sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-xl font-semibold tracking-[-0.04em] text-text-primary">
              Cycle Atlas
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-dim">
              {t("footer.dataSources")}
            </p>
          </div>

          <p className="max-w-3xl text-sm leading-6 text-text-secondary">
            <a
              href="https://github.com/JohnPitter/bitmonitor"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-btc transition-colors hover:text-text-primary"
            >
              GitHub
            </a>
            {" · "}
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
