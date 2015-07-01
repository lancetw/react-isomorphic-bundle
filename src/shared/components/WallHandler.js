import React, { PropTypes } from 'react'
import Wall from './WallComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'redux/react'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  post: state.post
}))
export default class WallHandler extends React.Component {

  constructor (props, context) {
    super(props, context)

    const dispatch = context.store.dispatch
    dispatch(PostActions.showList())
    dispatch(updateTitle('title.wall'))
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static async routerWillRun ({ dispatch }) {
    return await dispatch(PostActions.showList())
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.wall')}>
        <Wall
          {...this.props}
        />
      </DocumentTitle>
    )
  }
}
