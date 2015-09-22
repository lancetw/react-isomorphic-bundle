import React, { PropTypes } from 'react'
import Post from './PostComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import * as UploadActions from '../actions/UploadActions'
import * as MapActions from '../actions/MapActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
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
    super(props)

    this.state = { disableSubmit: true }

    const { dispatch, resolver, getState } = context.store

    dispatch(updateTitle('title.post'))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    this.mapActions = bindActionCreators(MapActions, dispatch)
    this.uploadActions = bindActionCreators(UploadActions, dispatch)

    resolver.resolve(this.postActions.init)
    resolver.resolve(this.uploadActions.init)
    resolver.resolve(this.mapActions.reload)
    resolver.resolve(this.authActions.showUser, props.auth.token)

    const { id } = props.params
    if (id) {
      resolver.resolve(this.postActions.loadPostEdit, id)
      setTimeout(() => {
        if (process.env.BROWSER) {
          this.setState({ disableSubmit: false })
        }
      }, 0)
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
          disableSubmit={this.state.disableSubmit}
        />
      </DocumentTitle>
    )
  }

}
