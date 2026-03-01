import { createContext, useState, useCallback, useMemo } from "react";
import { DEFAULT_LOCALE, STORAGE_KEY, LOCALE_MAP } from "./constants";

import en from "./locales/en.json";
import pt from "./locales/pt.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";

const messages = { en, pt, es, zh, ja };

export const I18nContext = createContext(null);

function detectLocale() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && messages[stored]) return stored;

  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const prefix = lang.split("-")[0].toLowerCase();
    if (LOCALE_MAP[prefix]) return LOCALE_MAP[prefix];
  }

  return DEFAULT_LOCALE;
}

function resolve(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(detectLocale);

  const setLocale = useCallback((code) => {
    if (messages[code]) {
      setLocaleState(code);
      localStorage.setItem(STORAGE_KEY, code);
      document.documentElement.lang = code;
    }
  }, []);

  const t = useCallback(
    (key, params) => {
      let str = resolve(messages[locale], key) ?? resolve(messages[DEFAULT_LOCALE], key) ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
        }
      }
      return str;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
