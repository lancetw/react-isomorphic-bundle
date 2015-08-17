export function fixLocaleName (locale) {
  if (locale === 'zh-hant-tw') {
    return 'zh-TW'
  }

  return locale
}

export function originLocaleName (locale) {
  if (locale === 'zh-TW') {
    return 'zh-hant-tw'
  }

  return locale
}
