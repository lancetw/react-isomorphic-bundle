const React = require('react')
const t = require('tcomb-form/lib')
const en = require('tcomb-form/lib/i18n/en')
const semantic = require('./semantic-custom')
t.form.Form.i18n = en
t.form.Form.templates = semantic

const Password = t.subtype(t.Str, s => s.length >= 6)

// https://gist.github.com/dperini/729294
const URL_RE = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;

const Url = t.subtype(t.Str, s => ((new RegExp(URL_RE)).test(s)))

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
const SignupFormOptionsZhHantCN = {
  auto: 'none',
  fields: {
    email: {
      type: 'email',
      error: '电子邮件信箱不合规定',
      attrs: {
        placeholder: '电子邮件信箱'
      }
    },
    password: {
      type: 'password',
      error: '长度应大于 6',
      attrs: {
        placeholder: '密码'
      }
    },
    passwordCheck: {
      type: 'password',
      error: '不一致',
      help: <i>请再输入一次密码</i>,
      attrs: {
        placeholder: '重新输入密码'
      }
    },
    tos: {
      label: '我同意服务条款'
    }
  }
}
exports.SignupFormOptions = function (locale) {
  const list = {
    'en': SignupFormOptionsEn,
    'zh-hant-tw': SignupFormOptionsZhHantTW,
    'zh-hant-cn': SignupFormOptionsZhHantCN
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
const LoginFormOptionsZhHantCN = {
  auto: 'none',
  fields: {
    email: {
      hasError: false,
      attrs: {
        placeholder: '电子邮件帐号'
      }
    },
    password: {
      type: 'password',
      hasError: false,
      attrs: {
        placeholder: '密码'
      }
    }
  }
}
exports.LoginFormOptions = function (locale) {
  const list = {
    'en': LoginFormOptionsEn,
    'zh-hant-tw': LoginFormOptionsZhHantTW,
    'zh-hant-cn': LoginFormOptionsZhHantCN
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
const ChangePasswordFormOptionsZhHantCN = {
  auto: 'none',
  fields: {
    password: {
      type: 'password',
      error: '长度应大于 6',
      hasError: false,
      attrs: {
        placeholder: '密码'
      }
    },
    passwordCheck: {
      type: 'password',
      error: '不一致',
      hasError: false,
      help: <i>请再输入一次密码</i>,
      attrs: {
        placeholder: '重新输入密码'
      }
    }
  }
}
exports.ChangePasswordFormOptions = function (locale) {
  const list = {
    'en': ChangePasswordFormOptionsEn,
    'zh-hant-tw': ChangePasswordFormOptionsZhHantTW,
    'zh-hant-cn': ChangePasswordFormOptionsZhHantCN
  }
  return list[locale]
}

exports.ManageForm = t.struct({
  ocname: t.Str,
  email: t.maybe(t.Str),
  contact: t.maybe(t.Str),
  url: t.maybe(t.Str),
  zipcode: t.maybe(t.Num),
  country: t.maybe(t.Str),
  city: t.maybe(t.Str),
  address: t.maybe(t.Str),
  tel: t.maybe(t.Str),
  fax: t.maybe(t.Str)
})
const ManageFormOptionsEn = {
  auto: 'none',
  fields: {
    ocname: {
      error: 'Please correct and submit again.',
      hasError: false,
      attrs: {
        placeholder: 'Organization Name'
      }
    },
    email: {
      type: 'email',
      error: 'email should be an email',
      hasError: false,
      attrs: {
        placeholder: 'Organization Email'
      }
    },
    contact: {
      hasError: false,
      attrs: {
        placeholder: 'Contact Name'
      }
    },
    url: {
      hasError: false,
      attrs: {
        placeholder: 'Website Link'
      }
    },
    zipcode: {
      hasError: false,
      attrs: {
        placeholder: 'Zip Code'
      }
    },
    country: {
      hasError: false,
      attrs: {
        placeholder: 'Country'
      }
    },
    city: {
      hasError: false,
      attrs: {
        placeholder: 'City'
      }
    },
    address: {
      hasError: false,
      attrs: {
        placeholder: 'Address'
      }
    },
    tel: {
      hasError: false,
      attrs: {
        placeholder: 'Tel'
      }
    },
    fax: {
      hasError: false,
      attrs: {
        placeholder: 'Fax'
      }
    }
  }
}
const ManageFormOptionsZhHantTW = {
  auto: 'none',
  fields: {
    ocname: {
      error: '請修正後再送出',
      hasError: false,
      attrs: {
        placeholder: '組織名稱'
      }
    },
    email: {
      type: 'email',
      error: '電子郵件信箱不合規定',
      hasError: false,
      attrs: {
        placeholder: '組織電子郵件信箱'
      }
    },
    contact: {
      hasError: false,
      attrs: {
        placeholder: '組織聯絡人'
      }
    },
    url: {
      hasError: false,
      attrs: {
        placeholder: '網站網址'
      }
    },
    zipcode: {
      hasError: false,
      attrs: {
        placeholder: '郵遞區號'
      }
    },
    country: {
      hasError: false,
      attrs: {
        placeholder: '國家'
      }
    },
    city: {
      hasError: false,
      attrs: {
        placeholder: '縣市'
      }
    },
    address: {
      hasError: false,
      attrs: {
        placeholder: '地址'
      }
    },
    tel: {
      hasError: false,
      attrs: {
        placeholder: '聯絡電話'
      }
    },
    fax: {
      hasError: false,
      attrs: {
        placeholder: '傳真'
      }
    }
  }
}
const ManageFormOptionsZhHantCN = {
  auto: 'none',
  fields: {
    ocname: {
      error: '请修正后再送出',
      hasError: false,
      attrs: {
        placeholder: '组织名称'
      }
    },
    email: {
      type: 'email',
      error: '电子邮件信箱不合规定',
      hasError: false,
      attrs: {
        placeholder: '组织电子邮件信箱'
      }
    },
    contact: {
      hasError: false,
      attrs: {
        placeholder: '组织联络人'
      }
    },
    url: {
      hasError: false,
      attrs: {
        placeholder: '网站网址'
      }
    },
    zipcode: {
      hasError: false,
      attrs: {
        placeholder: '邮递区号'
      }
    },
    country: {
      hasError: false,
      attrs: {
        placeholder: '国家'
      }
    },
    city: {
      hasError: false,
      attrs: {
        placeholder: '县市'
      }
    },
    address: {
      hasError: false,
      attrs: {
        placeholder: '地址'
      }
    },
    tel: {
      hasError: false,
      attrs: {
        placeholder: '联络电话'
      }
    },
    fax: {
      hasError: false,
      attrs: {
        placeholder: '传真'
      }
    }
  }
}
exports.ManageFormOptions = function (locale) {
  const list = {
    'en': ManageFormOptionsEn,
    'zh-hant-tw': ManageFormOptionsZhHantTW,
    'zh-hant-cn': ManageFormOptionsZhHantCN
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
const PostTypeZhHantCNArray = {
  1: '公告',
  2: '活动'
}
const PostTypeZhHantCN = t.enums(PostTypeZhHantCNArray)

exports.PostTypeArray = function (locale) {
  const list = {
    'en': PostTypeEnArray,
    'zh-hant-tw': PostTypeZhHantTWArray,
    'zh-hant-cn': PostTypeZhHantCNArray
  }
  return list[locale]
}

const PostPropEnArray = {
  0: 'Others',
  1: 'General',
  2: 'Music',
  3: 'Communication',
  4: 'Group Community',
  5: 'Special Groups',
  6: 'Missions',
  7: 'Evangelism',
  8: 'Sermon',
  9: 'Training',
  10: 'Welfare',
  11: 'Health Care',
  12: 'Counseling'
}
const PostPropEn = t.enums(PostPropEnArray)

const PostPropZhHantTWArray = {
  0: '其他',
  1: '一般',
  2: '音樂',
  3: '交流',
  4: '社群',
  5: '特殊群體',
  6: '宣教',
  7: '福音',
  8: '佈道',
  9: '培訓',
  10: '社福',
  11: '醫療',
  12: '諮商'
}
const PostPropZhHantTW = t.enums(PostPropZhHantTWArray)

const PostPropZhHantCNArray = {
  0: '其他',
  1: '一般',
  2: '音乐',
  3: '交流',
  4: '社群',
  5: '特殊群体',
  6: '宣教',
  7: '福音',
  8: '布道',
  9: '培训',
  10: '社福',
  11: '医疗',
  12: '谘商'
}
const PostPropZhHantCN = t.enums(PostPropZhHantCNArray)

exports.PostPropArray = function (locale) {
  const list = {
    'en': PostPropEnArray,
    'zh-hant-tw': PostPropZhHantTWArray,
    'zh-hant-cn': PostPropZhHantCNArray
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

const PostFormZhHantCN = t.subtype(t.struct({
  type: PostTypeZhHantCN,
  prop: PostPropZhHantCN,
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
    'zh-hant-tw': PostFormZhHantTW,
    'zh-hant-cn': PostFormZhHantCN
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
const PostFormOptionsZhHantCN = {
  error: <div data-errors="date">日期区间有误</div>,
  auto: 'none',
  fields: {
    type: {
      factory: t.form.Radio
    },
    prop: {
      factory: t.form.Select
    },
    startDate: {
      label: '开始日期',
      order: [ 'YYYY', 'M', 'D' ]
    },
    endDate: {
      label: '结束日期',
      order: [ 'YYYY', 'M', 'D' ]
    },
    title: {
      attrs: {
        placeholder: '标题'
      }
    },
    content: {
      type: 'textarea',
      attrs: {
        placeholder: '内容'
      }
    }
  }
}
exports.PostFormOptions = function (locale) {
  const list = {
    'en': PostFormOptionsEn,
    'zh-hant-tw': PostFormOptionsZhHantTW,
    'zh-hant-cn': PostFormOptionsZhHantCN
  }
  return list[locale]
}

const RegFormEn = t.subtype(t.struct({
  openDate: t.Dat,
  closeDate: t.Dat,
  url: t.maybe(Url)
}), function (value) {
  return (
    (value.openDate <= value.closeDate)
  )
})
const RegFormZhHantTW = t.subtype(t.struct({
  openDate: t.Dat,
  closeDate: t.Dat,
  url: t.maybe(Url)
}), function (value) {
  return (
    (value.openDate <= value.closeDate)
  )
})
const RegFormZhHantCN = t.subtype(t.struct({
  openDate: t.Dat,
  closeDate: t.Dat,
  url: t.maybe(Url)
}), function (value) {
  return (
    (value.openDate <= value.closeDate)
  )
})
exports.RegForm = function (locale) {
  const list = {
    'en': RegFormEn,
    'zh-hant-tw': RegFormZhHantTW,
    'zh-hant-cn': RegFormZhHantCN
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
    },
    url: {
      error: 'invalid format',
      attrs: {
        placeholder: 'Enrollment Link'
      }
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
      error: '無效的格式',
      attrs: {
        placeholder: '報名網址'
      }
    }
  }
}
const RegFormOptionsZhHantCN = {
  error: <div data-errors="date">日期区间有误</div>,
  auto: 'none',
  fields: {
    openDate: {
      label: '报名开放日期',
      order: [ 'YYYY', 'M', 'D' ]
    },
    closeDate: {
      label: '报名截止日期',
      order: [ 'YYYY', 'M', 'D' ]
    },
    url: {
      error: '无效的格式',
      attrs: {
        placeholder: '报名网址'
      }
    }
  }
}
exports.RegFormOptions = function (locale) {
  const list = {
    'en': RegFormOptionsEn,
    'zh-hant-tw': RegFormOptionsZhHantTW,
    'zh-hant-cn': RegFormOptionsZhHantCN
  }
  return list[locale]
}

exports.Tcomb = t
exports.Form = t.form.Form
