import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';

// Los recursos contienen las traducciones
const resources = {
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  }
};

i18n
  // Detecta el idioma del navegador
  .use(LanguageDetector)
  // Pasa el objeto i18n a react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React ya escapa los valores
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
