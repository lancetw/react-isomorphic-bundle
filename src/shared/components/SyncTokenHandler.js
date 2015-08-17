import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { save } from '../actions/AuthActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'

export default class SyncTokenHandler extends BaseComponent {

  constructor (props) {
    super(props)
    this.state = { isClient: false }
  }

  static propTypes = {
    location: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  componentDidMount () {
    this.setState({ isClient: true })

    const dispatch = this.context.store.dispatch
    const token = this.props.location.query.token

    new Promise((resolve) => {
      dispatch(save(token))
      setTimeout(() => {
        resolve('ok')
      }, 1000)

    }).then(() => this.context.router.transitionTo('/home'))
  }

  render () {
    const Translate = require('react-translate-component')
    const title = this._T('title.redirect')
    const defaultTitle = this._T('title.site')

    const msg = this.state.isClient
      ? <Translate content="redirect.msg" />
      : <div><a href="/"><Translate content="redirect.click" /></a></div>

    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <main className="ui stackable page grid">
          <div className="column">
            { msg }
          </div>
        </main>
      </DocumentTitle>
    )
  }
}
