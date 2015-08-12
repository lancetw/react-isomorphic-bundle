import React, { PropTypes } from 'react'
import Wall from './WallComponent'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  post: state.post
}))
export default class WallHandler extends React.Component {

  constructor (props, context) {
    super(props, context)
    const { dispatch } = context.store
    dispatch(PostActions.defaultList(0, 10, true))
    dispatch(updateTitle('title.wall'))
    this.state = { limit: 10, nextOffset: 0 }
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static async routerWillRun ({ dispatch }) {
    return await dispatch(PostActions.defaultList(0, 10, true))
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
