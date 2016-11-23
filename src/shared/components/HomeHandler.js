import React, { Component, PropTypes } from 'react'
import Home from './HomeComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'

class HomeHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    auth: PropTypes.object.isRequired,
    _T: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch } = this.props
    const { store: { resolver } } = this.context

    dispatch(updateTitle('title.home'))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    resolver.resolve(this.authActions.sync)
    resolver.resolve(this.postActions.newsList, 0, 8)
    resolver.resolve(this.authActions.showUser, this.props.auth.token)
  }

  render () {
    const { _T } = this.props
    const defaultTitle = _T('title.site')
    const protocol = 'https'
    const host = process.env.BROWSER
      ? window.location.host
      : this.context.store.host
    const meta = []
    meta.push({ 'name': 'description', 'content': '提供活動訊息張貼轉傳' })
    meta.push({ 'property': 'og:type', 'content': 'website' })
    meta.push({ 'property': 'author', 'content': '中華基督教網路發展協會 Chinese Christian Network Development Association' })
    meta.push({
      'property': 'og:image',
      'content': `${protocol}://${host}/images/oursevents@2x.png`
    })

    return (
      <div>
        <Helmet title={`${defaultTitle}`} meta={meta} />
        <Home {...this.props} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.news
}))(connectI18n()(HomeHandler))
