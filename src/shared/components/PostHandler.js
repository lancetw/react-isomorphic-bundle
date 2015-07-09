import React, { PropTypes } from 'react'
import Post from './PostComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'redux/react'
import * as PostActions from '../actions/PostActions'
import * as UploadActions from '../actions/UploadActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  post: state.post,
  upload: state.upload
}))
export default class PostHandler extends React.Component {

  constructor (props, context) {
    super(props, context)

    const dispatch = context.store.dispatch
    dispatch(updateTitle('title.post'))
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.post')}>
        <Post
          {...bindActionCreators(PostActions, dispatch)}
          {...bindActionCreators(UploadActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }

}
