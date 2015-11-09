import React, { PropTypes } from 'react'
import Post from './PostComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import * as UploadActions from '../actions/UploadActions'
import * as MapActions from '../actions/MapActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

class PostEditHandler extends BaseComponent {

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
  }

  componentWillMount () {
    const { dispatch } = this.props
    const { store: { resolver, getState } } = this.context

    dispatch(updateTitle('title.post'))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    this.mapActions = bindActionCreators(MapActions, dispatch)
    this.uploadActions = bindActionCreators(UploadActions, dispatch)

    resolver.resolve(this.postActions.init)
    resolver.resolve(this.uploadActions.init)
    resolver.resolve(this.mapActions.reload)
    resolver.resolve(this.authActions.showUser, this.props.auth.token)

    const { id } = this.props.params
    if (id) {
      resolver.resolve(this.postActions.loadPostEdit, id)
      if (process.env.BROWSER) {
        setTimeout(() => {
          this.setState({ disableSubmit: false })
        }, 0)
      }
    }
  }

  render () {
    const title = this._T('title.post')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props
    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Post
          {...bindActionCreators(PostActions, dispatch)}
          {...bindActionCreators(UploadActions, dispatch)}
          {...bindActionCreators(MapActions, dispatch)}
          {...this.props}
          defaultLocale={this.getLocale()}
          disableSubmit={this.state.disableSubmit} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.post,
  upload: state.upload,
  map: state.map
}))(PostEditHandler)
