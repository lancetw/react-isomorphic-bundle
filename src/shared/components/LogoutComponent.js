import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'

export default class Logout extends BaseComponent {

  static propTypes = {
    logout: PropTypes.func.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.releaseTimeout = undefined
    props.logout()
  }

  componentDidUpdate () {
    if (process.env.BROWSER) {
      this.releaseTimeout =
        setTimeout(() => this.context.history.replaceState({}, '/'), 1500)
    }
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  render () {
    const Translate = require('react-translate-component')

    const msg = !!process.env.BROWSER
      ? <Translate content="logout.msg" />
      : <div><Translate content="logout.msg2" />
          <a href="/auth/logout"><Translate content="logout.click" /></a>
        </div>
    return (
      <main className="ui has-header grid page container">
        <div className="column">
          <div className="ui center aligned orange segment">
            { msg }
          </div>
        </div>
      </main>
    )
  }
}
