import React, { PropTypes } from 'react'
import { save } from '../actions/AuthActions'
import Helmet from 'react-helmet'
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

    dispatch(save(token)).then(() => {
      setTimeout(() => this.context.history.replaceState({}, '/home'), 1500)
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
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <main className="ui has-header grid page container">
          <div className="column">
            <div className="ui center aligned orange segment">
              { msg }
            </div>
          </div>
        </main>
      </div>
    )
  }
}
