import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from "react-i18next"
import { en } from './en'
import { ru } from './ru'

i18n
  .use(initReactI18next) 
  .use(LanguageDetector)
  .init({
    resources: {
      'en': {
        translation: en
      },
      'ru-RU': {
        translation: ru
      }
    },
    fallbackLng: 'en',
    detection: {
      order: ['navigator'],
      caches: ['localStorage']
    }
})

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      en: {
        translation: typeof en
      },
      ru: {
        translation: typeof ru
      }
    }
  }
}

export const availableLanguages = ['en', 'ru'] as const
export type AvailableLanguage = typeof availableLanguages[number]
