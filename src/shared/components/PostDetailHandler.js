import React, { PropTypes } from 'react'
import PostDetail from './PostDetailComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import * as MapActions from '../actions/MapActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  auth: state.auth,
  post: state.post,
  map: state.map
}))
export default class PostDetailHandler extends React.Component {

  constructor (props, context) {
    super(props, context)
    const { dispatch, getState } = context.store

    const title = props.post.detail.title
    dispatch(updateTitle(title))

    const { id } = props.params
    if (id)
      Promise.all([
        dispatch(PostActions.show(id))
      ]).then(() => {
        setTimeout(() => {
          const { detail } = getState().post
          const map = {
            place: detail.place,
            lat: detail.lat,
            lng: detail.lng
          }
          dispatch(MapActions.setPin(map))
        }, 1000)
      })
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static async routerWillRun ({ dispatch, params, getState }) {
    await dispatch(AuthActions.showUser(getState().auth.token))

    const id = params.id
    await dispatch(PostActions.show(id))

    const map = {
      place: getState().post.detail.place,
      lat: getState().post.detail.lat,
      lng: getState().post.detail.lng
    }
    await dispatch(MapActions.setPin(map))

    const title = getState().post.detail.title
    await dispatch(updateTitle(title))
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    const { getState } = this.context.store
    const title = getState().locale.title

    return (
      <DocumentTitle title={title}>
        <PostDetail
          {...bindActionCreators(PostActions, dispatch)}
          {...bindActionCreators(MapActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }

}
