import React, { PropTypes } from 'react'
import Manage from './ManageComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import * as AuthActions from '../actions/AuthActions'
import * as UserActions from '../actions/UserActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'

@connect(state => ({
  auth: state.auth,
  post: state.manage,
  user: state.user
}))
export default class ManageHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props)
    const { dispatch, resolver } = context.store

    dispatch(updateTitle('title.manage'))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    this.userActions = bindActionCreators(UserActions, dispatch)

    resolver.resolve(this.userActions.getInfo, props.auth.token)
    resolver.resolve(this.authActions.showUser, props.auth.token)

    const user = props.auth.user.id
    resolver.resolve(this.postActions.manageList, 0, 5, user)
  }

  loadFunc () {
    const { dispatch, auth, post } = this.props
    const user = auth.user.id
    dispatch(PostActions
      .manageList(post.offset, post.limit, user))
  }

  render () {
    const title = this._T('title.manage')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props

    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Manage
          {...bindActionCreators(UserActions, dispatch)}
          {...this.props}
          loadFunc={::this.loadFunc}
          defaultLocale={this.getLocale()}
        />
      </DocumentTitle>
    )
  }
}
