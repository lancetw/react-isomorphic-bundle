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
  auth: state.auth,
  post: state.post,
  upload: state.upload,
  map: state.map
}))
export default class PostEditHandler extends React.Component {

  constructor (props, context) {
    super(props, context)
    const { dispatch, getState } = context.store

    dispatch(updateTitle('title.post'))

    dispatch(UploadActions.init())

    const { id } = props.params
    if (id)
      Promise.all([
        dispatch(PostActions.show(id))
      ]).then(() => {
        setTimeout(() => {
          const { detail } = getState().post
          const { user } = getState().auth

          const map = {
            place: detail.place,
            lat: detail.lat,
            lng: detail.lng
          }
          dispatch(MapActions.setPin(map))
        }, 500)
      })
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static async routerWillRun ({ dispatch, params, getState }) {
    const { id } = params
    if (id) {
      await dispatch(UploadActions.init())
      await dispatch(PostActions.show(id))
      const map = {
        place: getState().post.detail.place,
        lat: getState().post.detail.lat,
        lng: getState().post.detail.lng
      }
      await dispatch(MapActions.setPin(map))
    }
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
