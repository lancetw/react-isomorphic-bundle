import React, { PropTypes } from 'react'
import Home from './HomeComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
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
    const { dispatch, resolver } = context.store

    dispatch(updateTitle('title.home'))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    resolver.resolve(this.authActions.sync)
    resolver.resolve(this.postActions.newsList, 0, 6)
    resolver.resolve(this.authActions.showUser, props.auth.token)
  }

  render () {
    const title = this._T('title.home')
    const defaultTitle = this._T('title.site')
    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Home
          {...this.props}
        />
      </DocumentTitle>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.news
}))(HomeHandler)
