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
exports.SignupFormOptions = {
  auto: 'placeholders',
  fields: {
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
exports.ChangePasswordFormOptions = {
  auto: 'placeholders',
  fields: {
    password: {
      type: 'password',
      error: 'length should bigger than 6'
    },
    passwordCheck: {
      type: 'password',
      error: 'do not match',
      help: <i>Please enter password again</i>
    }
  }
}

const PostType = t.enums({
  1: 'News',
  2: 'Event'
})

const PostProp = t.enums({
  1: 'General',
  2: 'Music',
  3: 'Communication',
  4: 'Group Community',
  5: 'Special Groups',
  6: 'Health Care',
  7: 'Others'
})

exports.PostForm = t.subtype(t.struct({
  type: PostType,
  prop: PostProp,
  startDate: t.Dat,
  endDate: t.Dat,
  title: t.Str,
  content: t.Str
}), function (value) {
  return (
    (value.startDate <= value.endDate)
  )
})

exports.PostFormOptions = {
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

exports.Tcomb = t
exports.Form = t.form.Form
