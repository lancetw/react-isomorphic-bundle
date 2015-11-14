const React = require('react')
const t = require('tcomb-form/lib')
const en = require('tcomb-form/lib/i18n/en')
const semantic = require('./semantic-custom')
const _T = require('counterpart')
import { supportedList } from 'shared/utils/locale-utils'

supportedList.forEach((locale) => {
  _T.registerTranslations(locale, require('shared/i18n/' + locale))
})
_T.setFallbackLocale(supportedList[0])

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

const SignupFormOptionsI18n = function (locale) {
  return {
    auto: 'none',
    fields: {
      email: {
        type: 'email',
        error: _T('form.signup.email.error', {locale}),
        attrs: {
          placeholder: _T('form.signup.email.placeholder', {locale})
        }
      },
      password: {
        type: 'password',
        error: _T('form.signup.password.error', {locale}),
        attrs: {
          placeholder: _T('form.signup.password.placeholder', {locale})
        }
      },
      passwordCheck: {
        type: 'password',
        error: _T('form.signup.passwordCheck.error', {locale}),
        help: <i>{_T('form.signup.passwordCheck.help', {locale})}</i>,
        attrs: {
          placeholder: _T('form.signup.passwordCheck.placeholder', {locale})
        }
      },
      tos: {
        label: _T('form.signup.tos.label', {locale})
      }
    }
  }
}
exports.SignupFormOptions = function (locale) {
  return SignupFormOptionsI18n(locale)
}

exports.LoginForm = t.struct({
  email: t.Str,
  password: Password
})

const LoginFormOptionsI18n = function (locale) {
  return {
    auto: 'none',
    fields: {
      email: {
        hasError: false,
        attrs: {
          placeholder: _T('form.login.email.placeholder', {locale})
        }
      },
      password: {
        type: 'password',
        hasError: false,
        attrs: {
          placeholder: _T('form.login.password.placeholder', {locale})
        }
      }
    }
  }
}
exports.LoginFormOptions = function (locale) {
  return LoginFormOptionsI18n(locale)
}

exports.ChangePasswordForm = t.struct({
  password: Password,
  passwordCheck: t.Str
})

const ChangePasswordFormOptionsI18n = function (locale) {
  return {
    auto: 'none',
    fields: {
      password: {
        type: 'password',
        error: _T('form.changePassword.password.error', {locale}),
        hasError: false,
        attrs: {
          placeholder: _T('form.changePassword.password.placeholder', {locale})
        }
      },
      passwordCheck: {
        type: 'password',
        error: _T('form.changePassword.passwordCheck.error', {locale}),
        hasError: false,
        help: <i>{_T('form.changePassword.passwordCheck.help', {locale})}</i>,
        attrs: {
          placeholder: _T('form.changePassword.passwordCheck.placeholder', {locale})
        }
      }
    }
  }
}
exports.ChangePasswordFormOptions = function (locale) {
  return ChangePasswordFormOptionsI18n(locale)
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

const ManageFormOptionsI18n = function (locale) {
  return {
    auto: 'none',
    fields: {
      ocname: {
        error: _T('form.manage.ocname.error', {locale}),
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.ocname.placeholder', {locale})
        }
      },
      email: {
        type: 'email',
        error: _T('form.manage.email.error', {locale}),
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.email.placeholder', {locale})
        }
      },
      contact: {
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.contact.placeholder', {locale})
        }
      },
      url: {
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.url.placeholder', {locale})
        }
      },
      zipcode: {
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.zipcode.placeholder', {locale})
        }
      },
      country: {
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.country.placeholder', {locale})
        }
      },
      city: {
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.city.placeholder', {locale})
        }
      },
      address: {
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.address.placeholder', {locale})
        }
      },
      tel: {
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.tel.placeholder', {locale})
        }
      },
      fax: {
        hasError: false,
        attrs: {
          placeholder: _T('form.manage.fax.placeholder', {locale})
        }
      }
    }
  }
}
exports.ManageFormOptions = function (locale) {
  return ManageFormOptionsI18n(locale)
}

const PostTypeArrayI18n = function (locale) {
  return {
    1: _T('form.post.type.news', {locale}),
    2: _T('form.post.type.event', {locale})
  }
}
exports.PostTypeArray = function (locale) {
  return PostTypeArrayI18n(locale)
}

const PostTypeI18n = function (locale) {
  return t.enums(PostTypeArrayI18n(locale))
}
exports.PostType = function (locale) {
  return PostTypeI18n(locale)
}

const PostPropArrayI18n = function (locale) {
  return {
    0: _T('form.post.prop.others', {locale}),
    1: _T('form.post.prop.general', {locale}),
    2: _T('form.post.prop.music', {locale}),
    3: _T('form.post.prop.communication', {locale}),
    4: _T('form.post.prop.groupCommunity', {locale}),
    5: _T('form.post.prop.specialGroups', {locale}),
    6: _T('form.post.prop.missions', {locale}),
    7: _T('form.post.prop.evangelism', {locale}),
    8: _T('form.post.prop.sermon', {locale}),
    9: _T('form.post.prop.training', {locale}),
    10: _T('form.post.prop.welfare', {locale}),
    11: _T('form.post.prop.healthCare', {locale}),
    12: _T('form.post.prop.counseling', {locale})
  }
}
exports.PostPropArray = function (locale) {
  return PostPropArrayI18n(locale)
}

const PostPropI18n = function (locale) {
  return t.enums(PostPropArrayI18n(locale))
}
exports.PostProp = function (locale) {
  return PostPropI18n(locale)
}

const PostFormI18n = function (locale) {
  return t.subtype(t.struct({
    type: PostTypeI18n(locale),
    prop: PostPropI18n(locale),
    startDate: t.Dat,
    endDate: t.Dat,
    title: t.Str,
    content: t.Str
  }), function (value) {
    return (
      (value.startDate <= value.endDate)
    )
  })
}
exports.PostForm = function (locale) {
  return PostFormI18n(locale)
}

const PostFormOptionsI18n = function (locale) {
  return {
    error: <div data-errors="date">{_T('form.post.error', {locale})}</div>,
    auto: 'none',
    fields: {
      type: {
        factory: t.form.Radio
      },
      prop: {
        factory: t.form.Select
      },
      startDate: {
        label: _T('form.post.startDate.label', {locale}),
        order: [ 'YYYY', 'M', 'D' ]
      },
      endDate: {
        label: _T('form.post.endDate.label', {locale}),
        order: [ 'YYYY', 'M', 'D' ]
      },
      title: {
        attrs: {
          placeholder: _T('form.post.title.placeholder', {locale})
        }
      },
      content: {
        type: 'textarea',
        attrs: {
          placeholder: _T('form.post.content.placeholder', {locale})
        }
      }
    }
  }
}
exports.PostFormOptions = function (locale) {
  return PostFormOptionsI18n(locale)
}

const RegFormI18n = function (locale) {
  return t.subtype(t.struct({
    openDate: t.Dat,
    closeDate: t.Dat,
    url: t.maybe(Url)
  }), function (value) {
    return (
      (value.openDate <= value.closeDate)
    )
  })
}
exports.RegForm = function (locale) {
  return RegFormI18n(locale)
}

const RegFormOptionsI18n = function (locale) {
  return {
    error: <div data-errors="date">{_T('form.reg.error', {locale})}</div>,
    auto: 'none',
    fields: {
      openDate: {
        label: _T('form.reg.openDate.label', {locale}),
        order: [ 'YYYY', 'M', 'D' ]
      },
      closeDate: {
        label: _T('form.reg.closeDate.label', {locale}),
        order: [ 'YYYY', 'M', 'D' ]
      },
      url: {
        error: _T('form.reg.url.error', {locale}),
        attrs: {
          placeholder: _T('form.reg.url.placeholder', {locale})
        }
      }
    }
  }
}
exports.RegFormOptions = function (locale) {
  return RegFormOptionsI18n(locale)
}

exports.Tcomb = t
exports.Form = t.form.Form
