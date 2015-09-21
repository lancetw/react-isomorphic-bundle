import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
const { CSSTransitionGroup } = React.addons

export default class Login extends React.Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)

    this.releaseTimeout = null
  }

  componentWillUnmount () {
    typeof this.releaseTimeout === 'function'
      && clearTimeout(this.releaseTimeout)
  }

  handleSubmit (evt) {
    evt.preventDefault()
    const email = React.findDOMNode(this.refs.email).value
    const passwd = React.findDOMNode(this.refs.passwd).value
    this.props.login({ email, passwd })
  }

  render () {
    if (process.env.BROWSER) {
      if (this.props.auth.isAuthenticated) {
        this.releaseTimeout =
          setTimeout(() => {
            this.context.history.replaceState({}, '/ring/dash')
          }, 1000)
      }
    }

    const LoginClasses = classNames(
      'ui',
      'login',
      'form',
      'orange',
      'segment'
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
            <div className="image logo"></div>
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
                  className="ui orange button">
                  登入管理
                </button>
                <Link to="/ring/dash">dash</Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    )
  }
}

