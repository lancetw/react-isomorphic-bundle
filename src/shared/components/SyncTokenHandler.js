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
    const Translate = require('react-translate-component')
    const _t = require('counterpart')

    const msg = this.state.isClient
      ? <Translate content="redirect.msg" />
      : <div><a href="/"><Translate content="redirect.click" /></a></div>

    return (
      <DocumentTitle title={_t('title.redirect')}>
        <main className="ui stackable page grid">
          <div className="column">
            { msg }
          </div>
        </main>
      </DocumentTitle>
    )
  }
}
