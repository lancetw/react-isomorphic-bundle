import React, { PropTypes } from 'react'
import Post from './PostComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import * as UploadActions from '../actions/UploadActions'
import * as MapActions from '../actions/MapActions'
import * as UserActions from '../actions/UserActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'

@connect(state => ({
  auth: state.auth,
  post: state.post,
  upload: state.upload,
  map: state.map,
  user: state.user
}))
export default class PostHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)

    const {dispatch, resolver, getState} = context.store
    dispatch(updateTitle('title.post'))

    this.authActions = bindActionCreators(PostActions, dispatch)
    this.postActions = bindActionCreators(UploadActions, dispatch)
    this.mapActions = bindActionCreators(MapActions, dispatch)
    this.userActions = bindActionCreators(UserActions, dispatch)

    resolver.resolve(this.authActions.init)
    resolver.resolve(this.postActions.init)
    resolver.resolve(this.mapActions.init)
    resolver.resolve(this.userActions.getInfo, props.auth.token)
    setTimeout(() => {
      const { orginfo } = getState().user
      if (orginfo.cid) {
        const map = {
          place: orginfo.ocname,
          lat: orginfo.lat,
          lng: orginfo.lng
        }
        resolver.resolve(this.mapActions.setPin, map)
      }
    }, 1500)
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
