import { includes } from 'lodash'
const supportedList = ['zh-hant-tw', 'zh-hant-cn', 'en']

export function fallBackLocale (locale) {
  if (!locale) return locale

  const defaultLocale = supportedList[0]

  if (includes(supportedList, locale)) {
    return locale
  }

  return defaultLocale
}

export function fixLocaleName (locale) {
  if (!locale) return locale

  if (locale === 'zh-hant-tw') {
    return 'zh-TW'
  }
  if (locale === 'zh-hant-cn') {
    return 'zh-CN'
  }

  return locale
}

export function originLocaleName (locale) {
  if (!locale) return locale

  if (locale.startsWith('en')) {
    return 'en'
  }

  if (locale === 'zh-TW' || locale === 'zh-tw') {
    return 'zh-hant-tw'
  }

  if (locale === 'zh-CN' || locale === 'zh-cn') {
    return 'zh-hant-cn'
  }

  return fallBackLocale(locale)
}

