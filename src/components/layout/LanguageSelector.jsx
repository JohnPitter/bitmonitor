import { useEffect, useRef, useState } from "react";
import { useTranslation, SUPPORTED_LOCALES } from "../../i18n";
import Flag from "../common/Flag";

export default function LanguageSelector() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }

    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = SUPPORTED_LOCALES.find((item) => item.code === locale);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-text-secondary transition-all hover:border-white/14 hover:bg-white/10 hover:text-text-primary"
        aria-label="Select language"
      >
        <Flag code={current?.flag} size={22} />
        <span className="hidden text-xs font-medium sm:inline">{current?.label}</span>
        <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[190px] overflow-hidden rounded-[22px] border border-white/10 bg-[rgba(7,14,19,0.96)] py-2 shadow-[0_24px_90px_-48px_rgba(0,0,0,1)] backdrop-blur-xl">
          {SUPPORTED_LOCALES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-white/6 ${lang.code === locale ? "bg-btc/10 font-semibold text-btc" : "text-text-secondary"}`}
            >
              <Flag code={lang.flag} size={22} />
              <span>{lang.label}</span>
              {lang.code === locale && (
                <svg className="ml-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
