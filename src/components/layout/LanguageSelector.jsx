import { useState, useRef, useEffect } from "react";
import { useTranslation, SUPPORTED_LOCALES } from "../../i18n";
import Flag from "../common/Flag";

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
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all cursor-pointer"
        aria-label="Select language"
      >
        <Flag code={current?.flag} size={24} />
        <span className="hidden sm:inline text-xs font-medium">{current?.label}</span>
        <svg className="w-3.5 h-3.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-bg-card border border-border rounded-xl shadow-2xl py-2 min-w-[180px] z-50 backdrop-blur-sm">
          {SUPPORTED_LOCALES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-white/5 transition-all cursor-pointer ${lang.code === locale ? "text-btc font-semibold bg-btc/5" : "text-text-secondary"}`}
            >
              <Flag code={lang.flag} size={24} />
              <span>{lang.label}</span>
              {lang.code === locale && (
                <svg className="w-4 h-4 ml-auto text-btc" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
