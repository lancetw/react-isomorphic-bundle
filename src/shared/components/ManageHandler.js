import React, { PropTypes } from 'react'
import Manage from './ManageComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import * as AuthActions from '../actions/AuthActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'

@connect(state => ({
  auth: state.auth,
  post: state.post
}))
export default class ManageHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    const { dispatch, resolver } = context.store

    dispatch(updateTitle('title.manage'))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)

    resolver.resolve(this.authActions.showUser, props.auth.token)
    const user = props.auth.user.id
    resolver.resolve(this.postActions.defaultListWithUser, 0, 10, user, true)

    this.state = { limit: 10, nextOffset: 0 }
  }

  render () {
    const title = this._T('title.manage')
    const defaultTitle = this._T('title.site')

    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Manage
          {...this.props}
          loadFunc={::this.loadFunc}
          defaultLocale={this.getLocale()}
        />
      </DocumentTitle>
    )
  }

  loadFunc () {
    const { dispatch, auth } = this.props
    const user = auth.user.id
    const nextOffset = this.state.nextOffset + this.state.limit
    dispatch(PostActions
      .defaultListWithUser(nextOffset - 1, this.state.limit, user))

    this.setState({ nextOffset: nextOffset })
  }

}
