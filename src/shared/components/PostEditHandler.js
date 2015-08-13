import React, { PropTypes } from 'react'
import Post from './PostComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import * as UploadActions from '../actions/UploadActions'
import * as MapActions from '../actions/MapActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { getFileExt } from 'shared/utils/file-utils'
import { each } from 'lodash'

@connect(state => ({
  auth: state.auth,
  post: state.post,
  upload: state.upload,
  map: state.map
}))
export default class PostEditHandler extends React.Component {

  constructor (props, context) {
    super(props, context)
    const { dispatch, resolver, getState } = context.store

    dispatch(updateTitle('title.post'))

    dispatch(UploadActions.init())

    this.postActions = bindActionCreators(PostActions, dispatch)
    this.mapActions = bindActionCreators(MapActions, dispatch)
    this.uploadActions = bindActionCreators(UploadActions, dispatch)

    const { id } = props.params
    if (id) {
      resolver.resolve(this.postActions.show, id)
      setTimeout(() => {
        const { detail } = getState().post
        const map = {
          place: detail.place,
          lat: detail.lat,
          lng: detail.lng
        }
        resolver.resolve(this.mapActions.setPin, map)

        const { user } = getState().auth
        const files = typeof detail.file !== 'undefined'
        ? JSON.parse(detail.file)
        : []

        let src, name
        each(files, (filename, _index) => {
          if (getFileExt(filename.toLowerCase()) === 'pdf') {
            name = 'pdf.png'
            src = user.aud + '/images/' + name
          } else {
            name = filename
            src = user.aud + '/uploads/' + name
          }

          resolver.resolve(this.uploadActions.setImageFileName, name, _index)
        })
      }, 1500)
    }
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
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
