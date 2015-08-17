const React = require('react')
const t = require('tcomb-form/lib')
const en = require('tcomb-form/lib/i18n/en')
const semantic = require('./semantic-custom')
t.form.Form.i18n = en
t.form.Form.templates = semantic

const Password = t.subtype(t.Str, s => s.length >= 6)

exports.SignupForm = t.struct({
  email: t.Str,
  password: Password,
  passwordCheck: t.Str,
  tos: t.Bool
})
const SignupFormOptionsEn = {
  auto: 'placeholders',
  fields: {
    email: {
      type: 'email',
      error: 'email should be an email'
    },
    password: {
      type: 'password',
      error: 'length should bigger than 6'
    },
    passwordCheck: {
      type: 'password',
      error: 'do not match',
      help: <i>Please enter password again</i>
    },
    tos: {
      label: 'I agree to the Terms and Conditions'
    }
  }
}
const SignupFormOptionsZhHantTW = {
  auto: 'none',
  fields: {
    email: {
      type: 'email',
      error: '電子郵件信箱不合規定',
      attrs: {
        placeholder: '電子郵件信箱'
      }
    },
    password: {
      type: 'password',
      error: '長度應大於 6',
      attrs: {
        placeholder: '密碼'
      }
    },
    passwordCheck: {
      type: 'password',
      error: '不一致',
      help: <i>請再輸入一次密碼</i>,
      attrs: {
        placeholder: '重新輸入密碼'
      }
    },
    tos: {
      label: '我同意服務條款'
    }
  }
}
exports.SignupFormOptions = function (locale) {
  const list = {
    'en': SignupFormOptionsEn,
    'zh-hant-tw': SignupFormOptionsZhHantTW
  }
  return list[locale]
}

exports.LoginForm = t.struct({
  email: t.Str,
  password: Password
})
const LoginFormOptionsEn = {
  auto: 'placeholders',
  fields: {
    email: {
      hasError: false
    },
    password: {
      type: 'password',
      hasError: false
    }
  }
}
const LoginFormOptionsZhHantTW = {
  auto: 'none',
  fields: {
    email: {
      hasError: false,
      attrs: {
        placeholder: '電子郵件帳號'
      }
    },
    password: {
      type: 'password',
      hasError: false,
      attrs: {
        placeholder: '密碼'
      }
    }
  }
}
exports.LoginFormOptions = function (locale) {
  const list = {
    'en': LoginFormOptionsEn,
    'zh-hant-tw': LoginFormOptionsZhHantTW
  }
  return list[locale]
}

exports.ChangePasswordForm = t.struct({
  password: Password,
  passwordCheck: t.Str
})
const ChangePasswordFormOptionsEn = {
  auto: 'placeholders',
  fields: {
    password: {
      type: 'password',
      error: 'length should bigger than 6',
      hasError: false
    },
    passwordCheck: {
      type: 'password',
      error: 'do not match',
      hasError: false,
      help: <i>Please enter password again</i>
    }
  }
}
const ChangePasswordFormOptionsZhHantTW = {
  auto: 'none',
  fields: {
    password: {
      type: 'password',
      error: '長度應大於 6',
      hasError: false,
      attrs: {
        placeholder: '密碼'
      }
    },
    passwordCheck: {
      type: 'password',
      error: '不一致',
      hasError: false,
      help: <i>請再輸入一次密碼</i>,
      attrs: {
        placeholder: '重新輸入密碼'
      }
    }
  }
}
exports.ChangePasswordFormOptions = function (locale) {
  const list = {
    'en': ChangePasswordFormOptionsEn,
    'zh-hant-tw': ChangePasswordFormOptionsZhHantTW
  }
  return list[locale]
}

const PostTypeEnArray = {
  1: 'News',
  2: 'Event'
}
const PostTypeEn = t.enums(PostTypeEnArray)

const PostTypeZhHantTWArray = {
  1: '公告',
  2: '活動'
}
const PostTypeZhHantTW = t.enums(PostTypeZhHantTWArray)

exports.PostTypeArray = function (locale) {
  const list = {
    'en': PostTypeEnArray,
    'zh-hant-tw': PostTypeZhHantTWArray
  }
  return list[locale]
}

const PostPropEnArray = {
  1: 'General',
  2: 'Music',
  3: 'Communication',
  4: 'Group Community',
  5: 'Special Groups',
  6: 'Health Care',
  7: 'Others'
}
const PostPropEn = t.enums(PostPropEnArray)

const PostPropZhHantTWArray = {
  1: '一般',
  2: '音樂',
  3: '交流',
  4: '社群',
  5: '特殊群組',
  6: '健康',
  7: '其他'
}
const PostPropZhHantTW = t.enums(PostPropZhHantTWArray)

exports.PostPropArray = function (locale) {
  const list = {
    'en': PostPropEnArray,
    'zh-hant-tw': PostPropZhHantTWArray
  }
  return list[locale]
}

const PostFormEn = t.subtype(t.struct({
  type: PostTypeEn,
  prop: PostPropEn,
  startDate: t.Dat,
  endDate: t.Dat,
  title: t.Str,
  content: t.Str
}), function (value) {
  return (
    (value.startDate <= value.endDate)
  )
})

const PostFormZhHantTW = t.subtype(t.struct({
  type: PostTypeZhHantTW,
  prop: PostPropZhHantTW,
  startDate: t.Dat,
  endDate: t.Dat,
  title: t.Str,
  content: t.Str
}), function (value) {
  return (
    (value.startDate <= value.endDate)
  )
})

exports.PostForm = function (locale) {
  const list = {
    'en': PostFormEn,
    'zh-hant-tw': PostFormZhHantTW
  }
  return list[locale]
}
const PostFormOptionsEn = {
  error: <div data-errors="date">Date range is invalid.</div>,
  auto: 'placeholders',
  fields: {
    type: {
      factory: t.form.Radio
    },
    prop: {
      factory: t.form.Select
    },
    startDate: {
      label: 'Start date',
      order: [ 'YYYY', 'M', 'D' ]
    },
    endDate: {
      label: 'End date',
      order: [ 'YYYY', 'M', 'D' ]
    },
    content: {
      type: 'textarea'
    }
  }
}
const PostFormOptionsZhHantTW = {
  error: <div data-errors="date">日期區間有誤</div>,
  auto: 'none',
  fields: {
    type: {
      factory: t.form.Radio
    },
    prop: {
      factory: t.form.Select
    },
    startDate: {
      label: '開始日期',
      order: [ 'YYYY', 'M', 'D' ]
    },
    endDate: {
      label: '結束日期',
      order: [ 'YYYY', 'M', 'D' ]
    },
    title: {
      attrs: {
        placeholder: '標題'
      }
    },
    content: {
      type: 'textarea',
      attrs: {
        placeholder: '內容'
      }
    }
  }
}
exports.PostFormOptions = function (locale) {
  const list = {
    'en': PostFormOptionsEn,
    'zh-hant-tw': PostFormOptionsZhHantTW
  }
  return list[locale]
}

const RegFormEn = t.subtype(t.struct({
  openDate: t.Dat,
  closeDate: t.Dat,
  url: t.maybe(t.Str)
}), function (value) {
  return (
    (value.openDate <= value.closeDate)
  )
})
const RegFormZhHantTW = t.subtype(t.struct({
  openDate: t.Dat,
  closeDate: t.Dat,
  url: t.maybe(t.Str)
}), function (value) {
  return (
    (value.openDate <= value.closeDate)
  )
})
exports.RegForm = function (locale) {
  const list = {
    'en': RegFormEn,
    'zh-hant-tw': RegFormZhHantTW
  }
  return list[locale]
}

const RegFormOptionsEn = {
  error: <div data-errors="date">Date range is invalid.</div>,
  auto: 'placeholders',
  fields: {
    openDate: {
      label: 'Open date',
      order: [ 'YYYY', 'M', 'D' ]
    },
    closeDate: {
      label: 'Close date',
      order: [ 'YYYY', 'M', 'D' ]
    }
  }
}
const RegFormOptionsZhHantTW = {
  error: <div data-errors="date">日期區間有誤</div>,
  auto: 'none',
  fields: {
    openDate: {
      label: '報名開放日期',
      order: [ 'YYYY', 'M', 'D' ]
    },
    closeDate: {
      label: '報名截止日期',
      order: [ 'YYYY', 'M', 'D' ]
    },
    url: {
      attrs: {
        placeholder: '報名網址'
      }
    }
  }
}
exports.RegFormOptions = function (locale) {
  const list = {
    'en': RegFormOptionsEn,
    'zh-hant-tw': RegFormOptionsZhHantTW
  }
  return list[locale]
}

exports.Tcomb = t
exports.Form = t.form.Form
