import BrandMark from "../branding/BrandMark";
import { useTranslation } from "../../i18n";

export default function Loader() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(11,20,28,0.92),rgba(7,12,18,0.95))] px-8 py-10 text-center shadow-[0_36px_120px_-56px_rgba(0,0,0,1)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(98,216,182,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(213,138,62,0.14),transparent_32%)]" />
        <div className="relative">
          <BrandMark size={58} />
          <div className="mx-auto mt-6 h-9 w-9 rounded-full border-2 border-white/8 border-t-bull animate-spin" />
          <p className="mt-4 text-sm tracking-[0.08em] text-text-secondary">{t("loader.loading")}</p>
        </div>
      </div>
    </div>
  );
}
