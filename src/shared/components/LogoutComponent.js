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

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  render () {
    if (process.env.BROWSER) {
      this.releaseTimeout =
        setTimeout(() => this.context.history.replaceState({}, '/'), 1000)
    }

    const Translate = require('react-translate-component')

    const msg = !!process.env.BROWSER
      ? <Translate content="logout.msg" />
      : <div><Translate content="logout.msg2" />
          <a href="/auth/logout"><Translate content="logout.click" /></a>
        </div>
    return (
      <main className="ui stackable page grid">
        <div className="column">
          { msg }
        </div>
      </main>
    )
  }
}
