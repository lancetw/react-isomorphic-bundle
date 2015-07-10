import React, { PropTypes } from 'react/addons'
import BaseComponent from 'shared/components/BaseComponent'
import {
  Form,
  ChangePasswordForm,
  ChangePasswordFormOptions
} from 'shared/utils/forms'
import { isEmpty, clone } from 'lodash'
import classNames from 'classnames'
const { CSSTransitionGroup } = React.addons
import counterpart from 'counterpart'

export default class ChangePassword extends BaseComponent {

  constructor (props) {
    super(props)
    this._bind(
      'handleSubmit',
      'handleChange',
      'clearFormErrors'
    )
    this.messageTimeout = undefined
    this.releaseTimeout = undefined
    this.state = {
      value: { password: '', passwordCheck: '' },
      options: ChangePasswordFormOptions(counterpart.getLocale()),
      submited: false,
      updated: false
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  static propTypes = {
    changePassword: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  handleLocaleChange (newLocale) {
    this.setState({
      options: ChangePasswordFormOptions(newLocale)
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

    let value = this.refs.form.getValue()

    if (value
        && (value.password === value.passwordCheck)
      ) {
      this.clearFormErrors()
      this.setState({ submited: true })

      this.releaseTimeout =
        setTimeout(() => this.props.changePassword(value), 1000)
    } else {
      const pass = this.refs.form.getComponent('password')
      const check = this.refs.form.getComponent('passwordCheck')

      if (pass.state.value !== check.state.value)
        check.setState({ hasError: true })
      else
        check.setState({ hasError: false })


      if (pass.state.value.length < 6)
        pass.setState({ hasError: true })
      else
        pass.setState({ hasError: false })
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
    if (!isEmpty(errors))
      this.setState({ submited: false })
  }

  checkSubmited (info) {
    if (!isEmpty(info)) {
      this.setState({ submited: false })
      if (info.email)
        this.setState({ updated: true })
    }
  }

  componentWillReceiveProps (nextProps) {
    this.validation(nextProps.user.errors)
    this.checkSubmited(nextProps.user.info)
  }

  componentWillUnmount () {
    if (this.op)
      clearTimeout(this.releaseTimeout)
  }

  render () {
    const Translate = require('react-translate-component')

    let Loading = this.state.submited
      ? classNames('ui', 'orange', 'form', 'segment', 'loading')
      : classNames('ui', 'orange', 'form', 'segment')

    let Message = this.state.updated ?
    (
      <div className="ui success message">
        <div className="header">
          <Translate content="password.modified.title" />
        </div>
        <p><Translate content="password.modified.content" /></p>
      </div>
    ) : null

    if (this.state.updated)
      this.messageTimeout =
        setTimeout(() => this.setState({ updated: false }), 5000)

    return (
      <main className="ui two column stackable centered page grid">
        <div className="column">
          <CSSTransitionGroup transitionName="MessageTransition">
            {Message}
          </CSSTransitionGroup>
          <form
            className={Loading}
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
