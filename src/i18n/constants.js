export const DEFAULT_LOCALE = "en";
export const STORAGE_KEY = "bitmonitor-lang";
export const COUNTRY_CACHE_KEY = "bitmonitor-country";

export const SUPPORTED_LOCALES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

export const LOCALE_MAP = { en: "en", pt: "pt", es: "es", zh: "zh", ja: "ja" };

export const INTL_LOCALE_MAP = {
  en: "en-US",
  pt: "pt-BR",
  es: "es-ES",
  zh: "zh-CN",
  ja: "ja-JP",
};

export const COUNTRY_TO_LOCALE = {
  BR: "pt",
  PT: "pt",
  AO: "pt",
  MZ: "pt",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  UY: "es",
  PY: "es",
  BO: "es",
  CR: "es",
  GT: "es",
  CU: "es",
  DO: "es",
  HN: "es",
  SV: "es",
  NI: "es",
  PA: "es",
  CN: "zh",
  TW: "zh",
  HK: "zh",
  SG: "zh",
  JP: "ja",
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
};
