import React, { PropTypes } from 'react'
import { save } from '../actions/AuthActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'
import createLocation from 'history/lib/createLocation'

export default class SyncTokenHandler extends BaseComponent {

  static propTypes = {
    location: PropTypes.object.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
  }

  componentDidMount () {
    const dispatch = this.context.store.dispatch
    const token = this.props.location.query.token

    new Promise((resolve) => {
      dispatch(save(token))
      setTimeout(() => {
        resolve('ok')
      }, 1000)
    }).then(() => {
      this.context.history.transitionTo(createLocation('/home'))
    })
  }

  render () {
    const Translate = require('react-translate-component')
    const title = this._T('title.redirect')
    const defaultTitle = this._T('title.site')

    const msg = !!process.env.BROWSER
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
