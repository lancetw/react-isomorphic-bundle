import React, { PropTypes } from 'react'
import BaseComponent from 'shared/components/BaseComponent'

export default class Logout extends BaseComponent {

  constructor (props) {
    super(props)
    this.state = { isClient: false }
  }

  static propTypes = {
    logout: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.setState({ isClient: true })

    setTimeout(() => this.props.logout(), 1000)
    setTimeout(() => this.context.router.transitionTo('/'), 2000)
  }

  render () {
    const msg = this.state.isClient
      ? <div>You are now logged out.</div>
      : <div>If You want to log out,
          <a href="/auth/logout">click here.</a>
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
