// Import translations
import frData from './fr.json'
import enData from './en.json'

export type Language = 'fr' | 'en'

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

export const translations = {
  fr: frData,
  en: enData,
}

export const defaultLanguage: Language = 'fr'

export function getTranslations(lang: Language) {
  return translations[lang] || translations[defaultLanguage]
}
