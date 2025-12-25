// Import translations
import frData from './fr.json'
import enData from './en.json'
import nlData from './nl.json'
import esData from './es.json'

export type Language = 'fr' | 'en' | 'nl' | 'es'

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export const translations = {
  fr: frData,
  en: enData,
  nl: nlData,
  es: esData,
}

export const defaultLanguage: Language = 'fr'

export function getTranslations(lang: Language) {
  return translations[lang] || translations[defaultLanguage]
}

