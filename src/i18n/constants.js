export const DEFAULT_LOCALE = "en";
export const STORAGE_KEY = "bitmonitor-lang";

export const SUPPORTED_LOCALES = [
  { code: "en", label: "English", flag: "\ud83c\uddfa\ud83c\uddf8" },
  { code: "pt", label: "Portugu\u00eas", flag: "\ud83c\udde7\ud83c\uddf7" },
  { code: "es", label: "Espa\u00f1ol", flag: "\ud83c\uddea\ud83c\uddf8" },
  { code: "zh", label: "\u4e2d\u6587", flag: "\ud83c\udde8\ud83c\uddf3" },
  { code: "ja", label: "\u65e5\u672c\u8a9e", flag: "\ud83c\uddef\ud83c\uddf5" },
];

export const LOCALE_MAP = { en: "en", pt: "pt", es: "es", zh: "zh", ja: "ja" };

export const INTL_LOCALE_MAP = {
  en: "en-US",
  pt: "pt-BR",
  es: "es-ES",
  zh: "zh-CN",
  ja: "ja-JP",
};
