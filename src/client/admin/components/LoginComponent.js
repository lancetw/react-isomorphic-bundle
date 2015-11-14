import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import classNames from 'classnames'
import { isEmpty } from 'lodash'

export default class Login extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    sync: PropTypes.func.isRequired,
    showUser: PropTypes.func.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.releaseTimeout = null
  }

  componentDidUpdate () {
    if (process.env.BROWSER) {
      if (this.props.auth.isAuthenticated) {
        this.releaseTimeout =
          setTimeout(() => {
            this.context.history.replaceState({}, '/ring/permissions')
          }, 1500)
      }
    }
  }

  componentWillUnmount () {
    typeof this.releaseTimeout === 'function'
      && clearTimeout(this.releaseTimeout)
  }

  handleSubmit (evt) {
    evt.preventDefault()
    const email = ReactDOM.findDOMNode(this.refs.email).value
    const passwd = ReactDOM.findDOMNode(this.refs.passwd).value
    this.props.login({ email, passwd }).then((info) => {
      return this.props.sync()
    })
  }

  render () {
    const LoginClasses = classNames(
      'ui',
      'login',
      'form',
      'orange',
      'segment',
      { 'loading': this.props.auth.isFetching || !!this.props.auth.token }
    )

    const LoginBtnClasses = classNames(
      'ui',
      'orange',
      'button',
      { 'disabled': this.props.auth.isFetching }
    )

    /* eslint-disable max-len */
    return (
      <main className="ui stackable column centered page grid">
        <div className="column">
          <form
            className={LoginClasses}
            action=""
            method="post"
            onSubmit={::this.handleSubmit}>
            <div className="image logo admin"></div>
            <div className="three fields">
              <div className="field">
                <input ref="email" type="email" placeholder="電子郵件信箱" />
              </div>
              <div className="field">
                <input ref="passwd" type="password" placeholder="密碼" />
              </div>
              <div className="field">
                <button
                  type="submit"
                  className={LoginBtnClasses}>
                  登入管理
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    )
  }
}

