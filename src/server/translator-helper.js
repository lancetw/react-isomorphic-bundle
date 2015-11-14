import { originLocaleName, supportedList } from 'shared/utils/locale-utils'

export function TranslatorInit (defaultLocale) {
  const Translator = require('counterpart').Instance
  const lang = originLocaleName(defaultLocale)
  const translator = new Translator()
  supportedList.forEach((locale) => {
    translator.registerTranslations(locale, require('shared/i18n/' + locale))
  })
  translator.setFallbackLocale(supportedList[0])
  translator.setLocale(lang)

  return { translator, lang }
}
