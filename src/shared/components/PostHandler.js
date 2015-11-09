import React, { PropTypes } from 'react'
import Post from './PostComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import * as UploadActions from '../actions/UploadActions'
import * as MapActions from '../actions/MapActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

class PostHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch } = this.props
    const { store: { resolver, getState } } = this.context

    dispatch(updateTitle('title.post'))

    this.uploadActions = bindActionCreators(UploadActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    this.mapActions = bindActionCreators(MapActions, dispatch)

    resolver.resolve(this.uploadActions.init)
    resolver.resolve(this.mapActions.init)
    resolver.resolve(this.postActions.init)
    resolver.resolve(this.postActions.loadOrgInfoToMap)
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
          defaultLocale={this.getLocale()} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.post,
  upload: state.upload,
  map: state.map,
  user: state.user
}))(PostHandler)
