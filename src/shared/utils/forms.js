const React = require('react');

const t = require('tcomb-form/lib');
const en = require('tcomb-form/lib/i18n/en');
const semantic = require('./semantic-custom');

t.form.Form.i18n = en;
t.form.Form.templates = semantic;

const Password = t.subtype(t.Str, s => s.length >= 6);

exports.SignupFormOptions = {
  auto: 'placeholders',
  fields: {
    password: {
      type: 'password',
      error: function (value) {
        return (
          (value.length < 6 && 'length should bigger than 6')
        );
      }
    },
    passwordCheck: {
      type: 'password',
      error: 'do not match',
      help: <i>Please enter password again</i>
    },
    tos: {
      label: 'I agree to the Terms and Conditions',
    }
  }
};

exports.SignupForm = t.struct({
  email: t.Str,
  password: Password,
  passwordCheck: t.Str,
  tos: t.Bool
});

exports.LoginFormOptions = {
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
};

exports.LoginForm = t.struct({
  email: t.Str,
  password: Password
});

exports.ChangePasswordFormOptions = {
  auto: 'placeholders',
  fields: {
    password: {
      type: 'password',
      error: function (value) {
        return (
          (value.length < 6 && 'length should bigger than 6')
        );
      }
    },
    passwordCheck: {
      type: 'password',
      error: 'do not match',
      help: <i>Please enter password again</i>
    }
  }
};

exports.ChangePasswordForm = t.struct({
  password: Password,
  passwordCheck: t.Str
});

exports.Tcomb = t;
exports.Form = t.form.Form;
