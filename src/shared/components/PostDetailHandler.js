import React, { PropTypes } from 'react'
import PostDetail from './PostDetailComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import * as MapActions from '../actions/MapActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  post: state.post,
  map: state.map
}))
export default class PostDetailHandler extends React.Component {

  constructor (props, context) {
    super(props, context)
    const dispatch = context.store.dispatch

    const { getState } = context.store
    const id = props.params.id
    Promise.all([
      dispatch(PostActions.show(id))
    ]).then(() => {
      const title = getState().post.detail.title
      dispatch(updateTitle(title))
      const map = {
        place: getState().post.detail.place,
        lat: getState().post.detail.lat,
        lng: getState().post.detail.lng
      }
      setTimeout(() => {
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
    const id = params.id
    await dispatch(PostActions.show(id))

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
