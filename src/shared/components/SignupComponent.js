import React, { Component, PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { Form, SignupForm, SignupFormOptions } from 'shared/utils/forms'
import { isEmpty, clone, omit } from 'lodash'
import classNames from 'classnames'
import counterpart from 'counterpart'
import ReCAPTCHA from 'react-google-recaptcha'

export default class Signup extends Component {

  static propTypes = {
    submit: PropTypes.func.isRequired,
    signup: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.releaseTimeout = undefined
    this.releaseTimeout1 = undefined
    this.state = {
      value: {
        tos: false
      },
      options: SignupFormOptions(props.defaultLocale),
      submited: false
    }
  }

  componentDidMount () {
    counterpart.onLocaleChange(this.handleLocaleChange)
  }

  componentWillReceiveProps (nextProps) {
    this.validation(nextProps.signup.errors)
  }

  componentDidUpdate () {
    if (process.env.BROWSER) {
      if (this.props.signup.response && this.props.signup.response.token) {
        this.releaseTimeout1 =
          setTimeout(() => this.context.history.replaceState({}, '/home'), 1000)
      }
    }
  }

  componentWillUnmount () {
    counterpart.offLocaleChange(this.handleLocaleChange)
    if (this.op) {
      clearTimeout(this.releaseTimeout)
      clearTimeout(this.releaseTimeout1)
    }
  }

  handleRecaptchaChange = (value) => {}

  handleLocaleChange = (newLocale) => {
    this.setState({
      options: SignupFormOptions(newLocale)
    })
  }

  handleChange = (value, path) => {
    const pass = this.refs.form.getComponent('password')
    const check = this.refs.form.getComponent('passwordCheck')

    if (path[0] === 'passwordCheck') {
      if (pass.state.value !== check.state.value) {
        check.setState({ hasError: true })
      } else {
        check.setState({ hasError: false })
      }
    }

    if (path[0] === 'password') {
      if (pass.state.value.length < 6) {
        pass.setState({ hasError: true })
      } else {
        pass.setState({ hasError: false })
      }
    }

    this.setState({ value })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    const form = this.refs.form.getValue()
    const value = clone(form)
    value.recaptcha = this.refs.recaptcha.getValue()

    if (value && value.tos === true
        && (value.password === value.passwordCheck)
        && value.recaptcha) {
      this.clearFormErrors()
      let saved = clone(value)
      this.setState({ value: saved })
      saved = omit(saved, 'password')
      saved = omit(saved, 'passwordCheck')
      this.setState({ submited: true })
      this.refs.recaptcha.reset()

      this.releaseTimeout =
        setTimeout(() => this.props.submit(value), 1000)
    }
  }

  clearFormErrors () {
    const options = clone(this.state.options)
    options.fields = clone(options.fields)

    for (const key in options.fields) {
      if (options.fields.hasOwnProperty(key)) {
        options.fields[key] = clone(options.fields[key])
        if (options.fields[key].hasOwnProperty('hasError')) {
          options.fields[key].hasError = false
        }
      }
    }
    this.setState({ options: options })
  }

  validation = (errors) => {
    if (typeof errors !== 'undefined' && !isEmpty(errors)) {
      const options = clone(this.state.options)
      options.fields = clone(options.fields)

      if (typeof errors.map !== 'undefined') {
        errors.map(function (err) {
          if (err.code === 'invalid') {
            options.fields[err.field] = clone(options.fields[err.field])
            options.fields[err.field] = { hasError: true, error: err.message }
          } else {
            options.fields[err.path] = clone(options.fields[err.path])
            options.fields[err.path] = { hasError: true, error: err.message }
          }
        })
      }

      this.setState({ submited: false })
      this.setState({ options: options })
    }
  }

  render () {
    const LoadingClass = classNames(
      'ui',
      'form',
      'segment',
      { 'loading': this.state.submited }
    )

    const Translate = require('react-translate-component')

    return (
      <main className="ui two column centered stackable page grid">
        <div className="column">
          <div className="ui segment">
            <div className="ui center">
              <div className="image logo"></div>
              <h2 className="ui header">
                <div className="content">
                  <Translate content="register.hello" />
                  <div className="sub header">
                    <Translate content="register.msg" />
                  </div>
                </div>
              </h2>
            </div>
          </div>
        </div>
        <div className="column">
          <form
            className={LoadingClass}
            action="/auth/register"
            method="post"
            onSubmit={this.handleSubmit}>
            <Form
              ref="form"
              type={SignupForm}
              options={this.state.options}
              value={this.state.value}
              onChange={this.handleChange}
            />
            <div className="ui hidden divider" />
            { this.props.signup.sitekey && (
              <ReCAPTCHA
                ref="recaptcha"
                sitekey={this.props.signup.sitekey}
                onChange={this.handleRecaptchaChange}
                size="compact"
              />)
            }
            <div className="ui hidden divider" />
            <button
              type="submit"
              className="ui orange labeled icon huge button"
              disabled={this.state.submited}>
              <Translate content="register.submit" />
              <i className="add icon"></i>
            </button>
          </form>
        </div>
      </main>
    )
  }
}
