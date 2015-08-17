const supportedList = ['en', 'zh-hant-tw']

export function fixLocaleName (locale) {
  if (locale === 'zh-hant-tw') {
    return 'zh-TW'
  }

  return locale
}

export function originLocaleName (locale) {
  if (locale === 'zh-TW' || locale === 'zh-tw') {
    return 'zh-hant-tw'
  }

  if (locale === 'en-US' || locale === 'en-us') {
    return 'en'
  }

  return locale
}

