import React, { Component, PropTypes } from 'react'
import { save } from '../actions/AuthActions'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import createLocation from 'history/lib/createLocation'
import connectI18n from 'shared/components/addon/connect-i18n'

class SyncTokenHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    _T: PropTypes.func.isRequired
  }

  static contextTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.releaseTimout = undefined
  }

  componentDidMount () {
    const { dispatch, location } = this.props
    const { history } = this.context
    const token = location.query.token

    dispatch(save(token)).then(() => {
      this.releaseTimout = setTimeout(() => history.replaceState({}, '/manage'), 1500)
    })
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  render () {
    const { _T } = this.props
    const Translate = require('react-translate-component')
    const title = _T('title.redirect')
    const defaultTitle = _T('title.site')

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

export default connect()(connectI18n()(SyncTokenHandler))
