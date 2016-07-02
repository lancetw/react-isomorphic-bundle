import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Form, ChangePasswordForm } from 'shared/utils/forms'
import { isEmpty, clone } from 'lodash'
import classNames from 'classnames'
import { checkUnauthorized } from 'shared/utils/httpcheck'

export default class ChangePassword extends Component {

  static propTypes = {
    changePassword: PropTypes.func.isRequired,
    changePasswordInit: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.messageTimeout = undefined
    this.releaseTimeout = undefined
    this.state = {
      value: { password: '', passwordCheck: '' },
      options: props.options,
      submited: false,
      updated: false
    }
  }

  componentWillReceiveProps (nextProps) {
    checkUnauthorized(nextProps.user.errors, this.context.history.replaceState)

    this.validation(nextProps.user.errors)
    this.checkSubmited(nextProps.user._info)

    this.setState({ options: nextProps.options })
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
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
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    const value = this.refs.form.getValue()

    if (value && (value.password === value.passwordCheck)) {
      this.clearFormErrors()
      this.setState({ submited: true })

      this.releaseTimeout =
        setTimeout(() => this.props.changePassword(value), 1000)
    } else {
      const pass = this.refs.form.getComponent('password')
      const check = this.refs.form.getComponent('passwordCheck')

      if (pass.state.value !== check.state.value) {
        check.setState({ hasError: true })
      } else {
        check.setState({ hasError: false })
      }

      if (pass.state.value.length < 6) {
        pass.setState({ hasError: true })
      } else {
        pass.setState({ hasError: false })
      }
    }
  }

  clearFormErrors = () => {
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

  validation (errors) {
    if (!isEmpty(errors)) {
      this.setState({ submited: false })
    }
  }

  checkSubmited (info) {
    if (!isEmpty(info)) {
      this.props.changePasswordInit()
      this.setState({ submited: false })
      if (info.email) {
        this.setState({ updated: true })
      }
    }
  }

  render () {
    const Translate = require('react-translate-component')

    const LoadingClass = classNames(
      'ui',
      'form',
      'left aligned',
      'segment',
      {'loading': !!this.state.submited }
    )

    const Message = this.state.updated
      ? (
        <div className="ui success message">
          <div className="header">
            <Translate content="password.modified.title" />
          </div>
          <p><Translate content="password.modified.content" /></p>
        </div> )
      : null

    if (this.state.updated) {
      this.messageTimeout =
        setTimeout(() => this.setState({ updated: false }), 3000)
    }

    return (
      <main className="ui two column stackable centered page grid">
        <div className="column">
          <ReactCSSTransitionGroup
            transitionName="MessageTransition"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
            {Message}
          </ReactCSSTransitionGroup>
          <form
            className={LoadingClass}
            action="/auth/changePassword"
            method="post"
            onSubmit={this.handleSubmit}>
            <Form
              ref="form"
              type={ChangePasswordForm}
              options={this.state.options}
              value={this.state.value}
              onChange={this.handleChange} />
            <div className="ui hidden divider" />
            <button
              type="submit"
              className="ui orange labeled icon large button"
              disabled={this.state.submited}>
              <Translate content="password.submit" />
              <i className="add icon"></i>
            </button>
          </form>
        </div>
      </main>
    )
  }
}
