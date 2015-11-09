import React, { PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Link } from 'react-router'
import { BaseComponent } from 'shared/components'
import {
  Form,
  LoginForm,
  LoginFormOptions
} from 'shared/utils/forms'
import { isEmpty, clone, omit } from 'lodash'
import classNames from 'classnames'
import counterpart from 'counterpart'

export default class Login extends BaseComponent {

  static propTypes = {
    login: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)

    counterpart.setLocale(props.defaultLocale)

    this._bind(
      'handleSubmit',
      'clearFormErrors',
      'fillFormAllErrors'
    )
    this.releaseTimeout = undefined
    this.shakeTimeout = undefined
    this.state = {
      submited: false,
      ok: false,
      options: LoginFormOptions(counterpart.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  componentDidUpdate () {
    if (process.env.BROWSER) {
      if (this.props.auth.isAuthenticated) {
        let path
        const { location } = this.context.history
        if (typeof location !== 'undefined') {
          const { nextPathname } = location.state
          if (nextPathname) {
            path = nextPathname
          } else {
            path = '/home'
          }
        }
        this.releaseTimeout =
          setTimeout(() => this.context.history.replaceState({}, path), 1000)
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.submited) {
      this.validation(nextProps.auth.errors)
    }

    const { location } = this.context.history
    if (typeof location !== 'undefined') {
      const { nextPathname } = location.state
      if (nextPathname) {
        this.setState({ pleaseLogin: true })
      }
    }
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
      clearTimeout(this.shakeTimeout)
    }
  }

  handleLocaleChange (newLocale) {
    if (process.env.BROWSER) {
      this.setState({
        options: LoginFormOptions(newLocale)
      })
    }
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

  fillFormAllErrors () {
    const options = clone(this.state.options)
    options.fields = clone(options.fields)

    for (const key in options.fields) {
      if (options.fields.hasOwnProperty(key)) {
        options.fields[key] = clone(options.fields[key])
        if (options.fields[key].hasOwnProperty('hasError')) {
          options.fields[key].hasError = true
        }
      }
    }
    this.setState({ options: options })
  }

  validation (errors) {
    if (!isEmpty(errors)) {
      this.fillFormAllErrors()
      this.setState({ submited: false })
      this.setState({ errorShake: true })
      this.shakeTimeout = setTimeout(() => {
        this.setState({ errorShake: false })
        this.clearFormErrors()
      }, 500)
    }
  }

  render () {
    const Translate = require('react-translate-component')

    const Message = this.state.pleaseLogin
      ? (
        <div className="ui warning message">
          <div className="header">
            <Translate content="login.need.title" />
          </div>
        </div> )
      : null

    const LoginClasses = classNames(
      'ui',
      'login',
      'form',
      'segment',
      { 'loading': this.state.submited && !this.state.ok },
      { 'shake': this.state.errorShake },
      { 'shake-slow': this.state.errorShake },
      { 'shake-horizontal': this.state.errorShake }
    )

    /* eslint-disable max-len */
    return (
      <main className="ui stackable column centered page grid">
        <div className="column">
          <div className="ui two column middle aligned relaxed fitted stackable grid">
            <div className="column">
              <ReactCSSTransitionGroup
                transitionName="MessageTransition"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                {Message}
              </ReactCSSTransitionGroup>
              <form
                className={LoginClasses}
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
                  className="ui fluid orange large button"
                  disabled={this.state.ok}>
                  <Translate content="header.login" />
                </button>
              </form>
            </div>
            <div className="ui vertical divider">
              <Translate content="login.or" />
            </div>
            <div className="center aligned column">
              <a className="large facebook ui labeled icon button"
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

