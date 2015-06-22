import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { save } from '../actions/AuthActions'
import DocumentTitle from './addon/document-title'

export default class SyncTokenHandler extends React.Component {

  constructor (props) {
    super(props)
    this.state = { isClient: false }
  }

  static propTypes = {
    location: PropTypes.object.isRequired
  }

  static contextTypes = {
    redux: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.setState({ isClient: true })

    const dispatch = this.context.redux.dispatch
    const token = this.props.location.query.token
    setTimeout(() => dispatch(save(token)), 1000)
    setTimeout(() => this.context.router.transitionTo('/'), 2000)
  }

  render () {
    const msg = this.state.isClient
      ? <div>Redirecting...</div>
      : <div><a href="/">Click here to continue...</a></div>

    return (
      <DocumentTitle title='Redirecting...'>
        <main className="ui stackable page grid">
          <div className="column">
            { msg }
          </div>
        </main>
      </DocumentTitle>
    )
  }
}
