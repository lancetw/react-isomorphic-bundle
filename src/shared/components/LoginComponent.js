import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import BaseComponent from 'shared/components/BaseComponent'
import {
  Tcomb,
  Form,
  LoginForm,
  LoginFormOptions
} from 'shared/utils/forms'
import { isEmpty, clone, omit } from 'lodash'
import classNames from 'classnames'
import counterpart from 'counterpart'

const warn = console.warn
console.warn = function (warning) {
  if (/(setState)/.test(warning))
    throw new Error(warning)
  warn.apply(console, arguments)
}

export default class Login extends BaseComponent {

  constructor (props) {
    super(props)
    this._bind(
      'handleSubmit',
      'clearFormErrors',
      'fillFormAllErrors'
    )

    this.state = {
      submited: false,
      ok: false,
      options: LoginFormOptions(counterpart.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    sync: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleLocaleChange (newLocale) {
    this.setState({
      options: LoginFormOptions(newLocale)
    })
  }

  handleSubmit (evt) {
    evt.preventDefault()
    const value = this.refs.form.getValue()
    if (value) {
      let saved = clone(value)
      saved = omit(saved, 'password')
      this.setState({ value: saved })
      this.setState({ submited: true })
      this.clearFormErrors()

      setTimeout(() => this.props.login(value), 100)
    }
  }

  clearFormErrors () {
    let options = clone(this.state.options)
    options.fields = clone(options.fields)

    for (let key in options.fields) {
      if (options.fields.hasOwnProperty(key)) {
        options.fields[key] = clone(options.fields[key])
        if (options.fields[key].hasOwnProperty('hasError'))
          options.fields[key].hasError = false
      }
    }
    this.setState({ options: options })
  }

  fillFormAllErrors () {
    let options = clone(this.state.options)
    options.fields = clone(options.fields)

    for (let key in options.fields) {
      if (options.fields.hasOwnProperty(key)) {
        options.fields[key] = clone(options.fields[key])
        if (options.fields[key].hasOwnProperty('hasError'))
          options.fields[key].hasError = true
      }
    }
    this.setState({ options: options })
  }

  validation (errors) {
    if (!isEmpty(errors)) {
      this.fillFormAllErrors()
      this.setState({ submited: false })
    }
  }

  componentWillReceiveProps (nextProps) {
    this.validation(nextProps.auth.errors)
  }

  render () {
    if (this.props.auth.isAuthenticated) {
      const { state } = this.context.router.state.location
      let path
      if (state && state.nextPathname)
        path = state.nextPathname
      else
        path = '/home'

      setTimeout(() => this.context.router.replaceWith(path), 1000)
    }

    let Loading = this.state.submited && !(this.state.ok) ?
      classNames('ui', 'form', 'segment', 'loading') :
      classNames('ui', 'form', 'segment')

    const Translate = require('react-translate-component')

    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="
            ui two column middle aligned relaxed fitted stackable grid">
            <div className="column">
              <form
                className={Loading}
                action="/auth/login"
                method="post"
                onSubmit={this.handleSubmit}>
                <Form
                  ref="form"
                  type={LoginForm}
                  options={this.state.options}
                  value={this.state.value}
                />
                <div className="ui hidden divider" />
                <button
                  type="submit"
                  className="fluid ui blue large button"
                  disabled={this.state.ok}>
                  <Translate content="header.login" />
                </button>
              </form>
            </div>
            <div className="ui vertical divider">
              <Translate content="login.or" />
            </div>
            <div className="center aligned column">
              <a className="large blue ui labeled icon button"
                href="/auth/facebook">
                <i className="facebook icon"></i>
                <Translate content="login.facebook" />
              </a>
              <div className="ui hidden divider"></div>
              <Link className="ui huge green labeled icon button"
                to="/signup">
                <i className="signup icon"></i>
                <Translate content="login.signup" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

