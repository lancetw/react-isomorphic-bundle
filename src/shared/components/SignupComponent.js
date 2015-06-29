import React, { PropTypes } from 'react'
import BaseComponent from 'shared/components/BaseComponent'
import { Form, SignupForm, SignupFormOptions } from 'shared/utils/forms'
import { isEmpty, clone, omit } from 'lodash'
import classNames from 'classnames'
import counterpart from 'counterpart'

export default class Signup extends BaseComponent {

  constructor (props) {
    super(props)
    this._bind(
      'handleSubmit',
      'validation',
      'handleChange'
    )

    this.state = {
      value: {
        tos: false
      },
      options: SignupFormOptions(counterpart.getLocale()),
      submited: false,
      ok: false
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  static propTypes = {
    submit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    signup: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleLocaleChange (newLocale) {
    this.setState({
      options: SignupFormOptions(newLocale)
    })
  }

  handleChange (value, path) {
    const pass = this.refs.form.getComponent('password')
    const check = this.refs.form.getComponent('passwordCheck')

    if (path[0] === 'passwordCheck')
      if (pass.state.value !== check.state.value)
        check.setState({ hasError: true })
      else
        check.setState({ hasError: false })

    if (path[0] === 'password')
      if (pass.state.value.length < 6)
        pass.setState({ hasError: true })
      else
        pass.setState({ hasError: false })
  }

  handleSubmit (evt) {
    evt.preventDefault()
    const value = this.refs.form.getValue()
    if (value && value.tos === true &&
      (value.password === value.passwordCheck)) {
      let saved = clone(value)
      this.setState({ value: saved })
      saved = omit(saved, 'password')
      saved = omit(saved, 'passwordCheck')
      this.setState({ submited: true })
      this.clearFormErrors()

      setTimeout(() => this.props.submit(value), 1000)
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

  validation (errors) {
    if (!isEmpty(errors)) {
      let options = clone(this.state.options)
      options.fields = clone(options.fields)

      errors.map(function (err) {
        if (err.code === 'invalid') {
          options.fields[err.field] = clone(options.fields[err.field])
          options.fields[err.field] = { hasError: true, error: err.message }
        } else {
          options.fields[err.path] = clone(options.fields[err.path])
          options.fields[err.path] = { hasError: true, error: err.message }
        }
      })

      this.setState({ submited: false })
      this.setState({ options: options })
    }
  }

  checkSubmited (response) {
    if (response && response.token) {
      setTimeout(() => this.setState({ ok: true }), 300)
      setTimeout(() => this.setState({ submited: true }), 300)
      setTimeout(() => this.props.save(response.token), 100)
      setTimeout(() => this.context.router.transitionTo('/'), 1000)
    } else this.setState({ submited: false })
  }

  componentWillReceiveProps (nextProps) {
    this.validation(nextProps.signup.errors)
    this.checkSubmited(nextProps.signup.response)
  }

  render () {
    let Loading = this.state.submited && !(this.state.ok) ?
      classNames('ui', 'form', 'segment', 'loading') :
      classNames('ui', 'form', 'segment')

    const Translate = require('react-translate-component')

    return (
      <main className="ui two column stackable page grid">
        <div className="column">
          <div className="ui piled segment">
            <h2 className="ui header">
              <i className="users icon"></i>
              <div className="content">
                <Translate content="register.hello" />
                <div className="sub header">
                  <Translate content="register.msg" />
                </div>
              </div>
            </h2>
          </div>
        </div>
        <div className="column">
          <form
            className={Loading}
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
            <button
              type="submit"
              className="ui teal labeled icon huge button"
              disabled={this.state.submited && this.state.ok}>
              <Translate content="register.submit" />
              <i className="add icon"></i>
            </button>
          </form>
        </div>
      </main>
    )
  }
}
