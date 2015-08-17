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
import { BaseComponent } from 'shared/components'

@connect(state => ({
  auth: state.auth,
  post: state.post,
  upload: state.upload,
  map: state.map
}))
export default class PostEditHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    const { dispatch, resolver, getState } = context.store

    dispatch(updateTitle('title.post'))

    dispatch(UploadActions.init())

    this.postActions = bindActionCreators(PostActions, dispatch)
    this.mapActions = bindActionCreators(MapActions, dispatch)
    this.uploadActions = bindActionCreators(UploadActions, dispatch)

    resolver.resolve(this.mapActions.reload)

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

        const files = typeof detail.file !== 'undefined'
        ? JSON.parse(detail.file)
        : []

        let name
        each(files, (filename, _index) => {
          if (getFileExt(filename.toLowerCase()) === 'pdf') {
            name = 'pdf.png'
          } else {
            name = filename
          }
          resolver.resolve(this.uploadActions.setImageFileName, name, _index)
        })
      }, 2500)
    }
  }

  render () {
    const title = this._T('title.post')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Post
          {...bindActionCreators(PostActions, dispatch)}
          {...bindActionCreators(UploadActions, dispatch)}
          {...bindActionCreators(MapActions, dispatch)}
          {...this.props}
          defaultLocale={this.getLocale()}
        />
      </DocumentTitle>
    )
  }

}
