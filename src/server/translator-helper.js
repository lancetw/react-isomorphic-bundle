import { originLocaleName } from 'shared/utils/locale-utils'

export function TranslatorInit (defaultLocale) {
  const Translator = require('counterpart').Instance
  const lang = originLocaleName(defaultLocale)
  const translator = new Translator()
  translator.registerTranslations('en', require('shared/i18n/en'))
  translator.registerTranslations('zh-hant-tw', require('shared/i18n/zh-hant-tw'))
  translator.registerTranslations('zh-hant-cn', require('shared/i18n/zh-hant-cn'))
  translator.setFallbackLocale('zh-hant-tw')
  translator.setLocale(lang)

  return { translator, lang }
}
