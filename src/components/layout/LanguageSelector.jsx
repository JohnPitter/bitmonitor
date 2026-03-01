import { useState, useRef, useEffect } from "react";
import { useTranslation, SUPPORTED_LOCALES } from "../../i18n";

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = SUPPORTED_LOCALES.find((l) => l.code === locale);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-border/50 transition-colors cursor-pointer"
        aria-label="Select language"
      >
        <span className="text-lg leading-none">{current?.flag}</span>
        <span className="hidden sm:inline text-xs">{current?.label}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-bg-card border border-border rounded-lg shadow-lg py-1.5 min-w-[160px] z-50">
          {SUPPORTED_LOCALES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-border/50 transition-colors cursor-pointer ${lang.code === locale ? "text-btc font-medium bg-btc/5" : "text-text-secondary"}`}
            >
              <span className="text-lg leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
