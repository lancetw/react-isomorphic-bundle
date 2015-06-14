const React = require('react');

const t = require('tcomb-form/lib');
const en = require('tcomb-form/lib/i18n/en');
const semantic = require('./semantic-custom');

t.form.Form.i18n = en;
t.form.Form.templates = semantic;

exports.SignupFormOptions = {
  auto: 'placeholders',
  fields: {
    password: {
      type: 'password',
      error: function (value) {
        return (
          (value.length < 6 && 'Must be 6 or more')
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
  password: t.Str,
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
  password: t.Str
});


exports.Tcomb = t;
exports.Form = t.form.Form;
