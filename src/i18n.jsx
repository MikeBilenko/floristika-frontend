import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import lvTranslations from "./locales/lv.json";
import ruTranslations from "./locales/ru.json";

const languageKey = "lang";

const savedLanguage = localStorage.getItem(languageKey) || "en";

i18n
  .use(initReactI18next) // Bind react-i18next to i18next
  .init({
    resources: {
      en: { translation: enTranslations },
      lv: { translation: lvTranslations },
      ru: { translation: ruTranslations },
    },
    lng: savedLanguage, // Default language
    fallbackLng: "en", // Fallback language
    interpolation: {
      escapeValue: false, // Allow HTML content in translations
    },
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(languageKey, lng);
});

export default i18n;
