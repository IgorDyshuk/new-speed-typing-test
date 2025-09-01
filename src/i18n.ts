import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// European languages
import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import nl from "./locales/nl.json";
import pl from "./locales/pl.json";
import ru from "./locales/ru.json";
import uk from "./locales/uk.json";
import cs from "./locales/cs.json";
import hu from "./locales/hu.json";

// Asian languages
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";

// Additional languages
import sv from "./locales/sv.json";
import tr from "./locales/tr.json";
import ar from "./locales/ar.json";
import hi from "./locales/hi.json";
import ro from "./locales/ro.json";

const resources = {
  // European languages
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  it: { translation: it },
  pt: { translation: pt },
  nl: { translation: nl },
  pl: { translation: pl },
  ru: { translation: ru },
  uk: { translation: uk },
  cs: { translation: cs },
  hu: { translation: hu },

  // Asian languages
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },

  // Additional languages
  sv: { translation: sv },
  tr: { translation: tr },
  ar: { translation: ar },
  hi: { translation: hi },
  ro: { translation: ro },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

export default i18n;
