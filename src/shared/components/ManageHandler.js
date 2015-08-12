import React, { PropTypes } from 'react'
import Manage from './ManageComponent'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import * as AuthActions from '../actions/AuthActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  auth: state.auth,
  post: state.post
}))
export default class ManageHandler extends React.Component {

  constructor (props, context) {
    super(props, context)
    const { dispatch } = context.store
    dispatch(AuthActions.showUser(props.auth.token))
    const user = props.auth.user.id
    dispatch(PostActions.defaultListWithUser(0, 10, user, true))
    dispatch(updateTitle('title.manage'))
    this.state = { limit: 10, nextOffset: 0 }
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  loadFunc () {
    const { dispatch, auth } = this.props
    const user = auth.user.id
    const nextOffset = this.state.nextOffset + this.state.limit
    dispatch(PostActions
      .defaultListWithUser(nextOffset - 1, this.state.limit, user))

    this.setState({ nextOffset: nextOffset })
  }

  static async routerWillRun ({ dispatch, getState }) {
    await dispatch(AuthActions.showUser(getState().auth.token))
    const user = getState().auth.user.id
    await dispatch(PostActions.defaultListWithUser(0, 10, user, true))
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.manage')}>
        <Manage
          {...this.props}
          loadFunc={::this.loadFunc}
        />
      </DocumentTitle>
    )
  }
}
