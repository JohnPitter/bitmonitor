import { createContext, useState, useCallback, useMemo, useEffect } from "react";
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

function resolve(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const controller = new AbortController();
    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.country_code) return;
        localStorage.setItem(COUNTRY_CACHE_KEY, data.country_code);
        const detected = COUNTRY_TO_LOCALE[data.country_code];
        if (detected && detected !== locale) {
          setLocaleState(detected);
          document.documentElement.lang = detected;
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

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
