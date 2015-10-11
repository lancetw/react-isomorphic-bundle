export function tongwenAuto(obj, lang) {
  if (typeof TongWen === 'undefined') return obj
  if (!obj) return obj

  if (lang === 'zh-cn'
      || lang === 'zh-CN'
      || lang === 'zh-hant-cn'
      || lang === 'zh-hant'
      || lang === 'zh') {
    return TongWen.trans2Simp(obj)
  }

  if (lang === 'zh-tw'
      || lang === 'zh-hant-tw') {
    return TongWen.trans2Trad(obj)
  }

  return obj
}

export function tongwenAutoStr(obj, lang) {
  if (typeof TongWen === 'undefined') return obj
  if (!obj) return obj

  if (lang === 'zh-tw'
      || lang === 'zh-hant-tw') {
    return TongWen.convert(obj, 'traditional')
  }

  if (lang === 'zh-cn'
      || lang === 'zh-CN'
      || lang === 'zh-hant-cn'
      || lang === 'zh-hant'
      || lang === 'zh') {
    return TongWen.convert(obj, 'simplified')
  }

  return obj
}

