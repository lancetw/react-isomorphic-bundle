import React, { PropTypes } from 'react'
import Home from './HomeComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

class HomeHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props)
  }

  componentWillMount () {
    const { dispatch } = this.props
    const { store: { resolver } } = this.context

    dispatch(updateTitle('title.home'))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    resolver.resolve(this.authActions.sync)
    resolver.resolve(this.postActions.newsList, 0, 6)
    resolver.resolve(this.authActions.showUser, this.props.auth.token)
  }

  render () {
    const title = this._T('title.home')
    const defaultTitle = this._T('title.site')

    const meta = []
    meta.push({ 'property': 'og:type', 'content': 'article' })

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} meta={meta} />
        <Home
          {...this.props}
          defaultLocale={this.getLocale()}
        />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.news
}))(HomeHandler)
