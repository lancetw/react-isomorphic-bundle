import React, { PropTypes } from 'react'
import BaseComponent from 'shared/components/BaseComponent'

export default class Logout extends BaseComponent {

  constructor (props) {
    super(props)
    this.state = { isClient: false }

    props.logout()
  }

  static propTypes = {
    logout: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.setState({ isClient: true })
  }

  render () {
    setTimeout(() => this.context.router.replaceWith('/'), 1000)

    const Translate = require('react-translate-component')

    const msg = this.state.isClient
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
