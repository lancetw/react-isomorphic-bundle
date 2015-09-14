export const supportedList = ['zh-hant-tw', 'zh-hant-cn', 'en']

export function fixLocaleName (locale) {
  if (locale === 'zh-hant-tw') {
    return 'zh-TW'
  }
  if (locale === 'zh-hant-cn') {
    return 'zh-CN'
  }

  return locale
}

export function originLocaleName (locale) {
  if (locale === 'zh-TW' || locale === 'zh-tw') {
    return 'zh-hant-tw'
  }

  if (locale === 'zh-CN' || locale === 'zh-cn') {
    return 'zh-hant-cn'
  }

  if (locale === 'en-US' || locale === 'en-us') {
    return 'en'
  }

  return locale
}

