import React, { PropTypes } from 'react'
import Post from './PostComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import * as UploadActions from '../actions/UploadActions'
import * as MapActions from '../actions/MapActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  post: state.post,
  upload: state.upload,
  map: state.map
}))
export default class PostHandler extends React.Component {

  constructor (props, context) {
    super(props, context)

    const dispatch = context.store.dispatch
    dispatch(updateTitle('title.post'))

    dispatch(PostActions.init())
    dispatch(UploadActions.init())
    dispatch(MapActions.init())
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
          {...bindActionCreators(MapActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }

}
