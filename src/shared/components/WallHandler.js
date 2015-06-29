import React, { PropTypes } from 'react'
import Wall from './WallComponent'
import { connect } from 'redux/react'
import { showList } from '../actions/PostActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  post: state.post
}))
export default class WallHandler extends React.Component {

  constructor (props, context) {
    super(props, context)

    const dispatch = context.redux.dispatch
    dispatch(showList())
  }

  static contextTypes = {
    redux: PropTypes.object.isRequired
  }

  static async routerWillRun ({ dispatch }) {
    return await dispatch(showList())
  }

  render () {
    const _t = require('counterpart')

    return (
      <DocumentTitle title={_t('title.wall')}>
        <Wall
          {...this.props}
        />
      </DocumentTitle>
    )
  }
}
