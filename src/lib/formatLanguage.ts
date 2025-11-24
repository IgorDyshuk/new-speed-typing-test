export const LANGUAGES = [
  { label: "english", code: "en" },
  { label: "german", code: "de" },
  { label: "french", code: "fr" },
  { label: "spanish", code: "es" },
  { label: "italian", code: "it" },
  { label: "portuguese", code: "pt" },
  { label: "dutch", code: "nl" },
  { label: "polish", code: "pl" },
  { label: "russian", code: "ru" },
  { label: "ukrainian", code: "uk" },
  { label: "czech", code: "cs" },
  { label: "hungarian", code: "hu" },

  { label: "chinese", code: "zh" },
  { label: "japanese", code: "ja" },
  { label: "korean", code: "ko" },

  { label: "swedish", code: "sv" },
  { label: "turkish", code: "tr" },
  { label: "arabic", code: "ar" },
  { label: "hindi", code: "hi" },
  { label: "romanian", code: "ro" },
];

export const getLanguageLabel = (code: string) =>
  LANGUAGES.find((lang) => lang.code === code)?.label ?? code;
