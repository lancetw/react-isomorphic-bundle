export function translate (key, self) {
  let _self = typeof self !== 'undefined' ? self : this

  if (typeof _self.context.translator !== 'undefined')
    return _self.context.translator.translate(key)
  else {
    const _t = require('counterpart')
    return _t(key)
  }
}

export function fixLocaleName (locale) {
  if (locale === 'zh-hant-tw')
    return 'zh-TW'

  return locale
}

export function originLocaleName (locale) {
  if (locale === 'zh-TW')
    return 'zh-hant-tw'

  return locale
}
