import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import BaseComponent from 'shared/components/BaseComponent'
import { Form, LoginForm, LoginFormOptions } from 'shared/utils/forms'
import { isEmpty, clone, omit } from 'lodash'
import classNames from 'classnames'

export default class Login extends BaseComponent {

  constructor (props) {
    super(props)
    this.state = {
      value: {
        email: '',
        password: ''
      },
      options: LoginFormOptions,
      submited: false,
      ok: false
    }

    this._bind('handleSubmit', 'clearFormErrors', 'fillFormAllErrors')
  }

  static propTypes = {
    login: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
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

      setTimeout(() => this.props.login(value), 1000)
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

  checkSubmited (token) {
    if (token) {
      setTimeout(() => this.setState({ ok: true }), 0)
      setTimeout(() => this.setState({ submited: true }), 300)
      setTimeout(() => this.props.save(token), 100)
      setTimeout(() => this.context.router.transitionTo('/'), 1000)
    } else this.setState({ submited: false })
  }

  componentWillReceiveProps (nextProps) {
    this.validation(nextProps.auth.errors)
    this.checkSubmited(nextProps.auth.token)
  }

  render () {
    let Loading = this.state.submited && !(this.state.ok) ?
      classNames('ui', 'form', 'segment', 'loading') :
      classNames('ui', 'form', 'segment')

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
                onSubmit={this.handleSubmit}
              >
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
                  disabled={this.state.ok}
                >
                  Log In
                </button>
              </form>
            </div>
            <div className="ui vertical divider">
              or
            </div>
            <div className="center aligned column">
              <a className="large blue ui labeled icon button"
                href="/auth/facebook">
                <i className="facebook icon"></i>
                Sign In with Facebook
              </a>
              <div className="ui hidden divider"></div>
              <Link className="ui huge green labeled icon button"
                to="/signup">
                <i className="signup icon"></i>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

