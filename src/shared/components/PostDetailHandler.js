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
    const { dispatch, resolver, getState } = context.store

    const title = props.post.detail.title
    dispatch(updateTitle(title))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    this.mapActions = bindActionCreators(MapActions, dispatch)

    resolver.resolve(this.mapActions.reload)
    resolver.resolve(this.authActions.showUser, props.auth.token)

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
      }, 2500)
    }
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
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
