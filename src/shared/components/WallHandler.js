import React, { PropTypes } from 'react'
import Wall from './WallComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  auth: state.auth,
  post: state.post
}))
export default class WallHandler extends React.Component {

  constructor (props, context) {
    super(props, context)
    const { dispatch, resolver } = context.store

    dispatch(updateTitle('title.wall'))

    this.postActions = bindActionCreators(PostActions, dispatch)
    resolver.resolve(this.postActions.defaultList, 0, 10, true)
    this.authActions = bindActionCreators(AuthActions, dispatch)
    resolver.resolve(this.authActions.showUser, props.auth.token)
    this.state = { limit: 10, nextOffset: 0 }
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  loadFunc () {
    const { dispatch } = this.props
    const nextOffset = this.state.nextOffset + this.state.limit
    dispatch(PostActions.defaultList(nextOffset - 1, this.state.limit))

    this.setState({ nextOffset: nextOffset })
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.wall')}>
        <Wall
          {...this.props}
          loadFunc={::this.loadFunc}
        />
      </DocumentTitle>
    )
  }
}
