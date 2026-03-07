import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, STORAGE_KEY, LOCALE_MAP, COUNTRY_CACHE_KEY, COUNTRY_TO_LOCALE } from "./constants";

import en from "./locales/en.json";
import pt from "./locales/pt.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";

const messages = { en, pt, es, zh, ja };

export const I18nContext = createContext(null);

function detectFromBrowser() {
  const browserLangs = navigator.languages || [navigator.language];

  for (const lang of browserLangs) {
    const prefix = lang.split("-")[0].toLowerCase();
    if (LOCALE_MAP[prefix]) return LOCALE_MAP[prefix];
  }

  return DEFAULT_LOCALE;
}

function getInitialLocale() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && messages[stored]) return stored;

  const cachedCountry = localStorage.getItem(COUNTRY_CACHE_KEY);
  if (cachedCountry && COUNTRY_TO_LOCALE[cachedCountry]) {
    return COUNTRY_TO_LOCALE[cachedCountry];
  }

  return detectFromBrowser();
}

function resolve(object, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], object);
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((code) => {
    if (!messages[code]) return;

    setLocaleState(code);
    localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const t = useCallback((key, params) => {
    let value = resolve(messages[locale], key) ?? resolve(messages[DEFAULT_LOCALE], key) ?? key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, "g"), String(paramValue));
      });
    }

    return value;
  }, [locale]);

  const contextValue = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}
