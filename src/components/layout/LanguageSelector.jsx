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
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-text-secondary hover:text-text-primary hover:bg-border/50 transition-colors cursor-pointer"
        aria-label="Select language"
      >
        <span>{current?.flag}</span>
        <span className="hidden sm:inline">{current?.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px] z-50">
          {SUPPORTED_LOCALES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-border/50 transition-colors cursor-pointer ${lang.code === locale ? "text-btc font-medium" : "text-text-secondary"}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
