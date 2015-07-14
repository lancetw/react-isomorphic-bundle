import React, { PropTypes } from 'react'
import Cal from './CalComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  post: state.post
}))
export default class CalHandler extends React.Component {

  constructor (props, context) {
    super(props, context)

    const dispatch = context.store.dispatch
    dispatch(PostActions.fetchList())
    dispatch(updateTitle('title.cal'))
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static async routerWillRun ({ dispatch }) {
    return await dispatch(PostActions.fetchList())
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.cal')}>
        <Cal
          {...this.props}
          {...bindActionCreators(PostActions, dispatch)}
        />
      </DocumentTitle>
    )
  }
}
