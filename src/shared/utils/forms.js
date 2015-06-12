const React = require('react');

const t = require('tcomb-form/lib');
const en = require('tcomb-form/lib/i18n/en');
const semantic = require('./semantic-custom');

t.form.Form.i18n = en;
t.form.Form.templates = semantic;

exports.Form = t.form.Form;

exports.SignupForm = t.struct({
  email: t.Str,
  password: t.Str,
  tos: t.Bool
});

exports.SignupFormOptions = {
  auto: 'placeholders',
  fields: {
    password: {
      type: 'password'
    },
    tos: {
      label: 'I agree to the Terms and Conditions'
    }
  }
};
