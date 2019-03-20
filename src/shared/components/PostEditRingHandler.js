import React, { Component, PropTypes } from 'react'
import Post from './PostComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import * as UploadActions from '../actions/UploadActions'
import * as MapActions from '../actions/MapActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'
import {
  PostForm,
  PostFormOptions,
  RegForm,
  RegFormOptions
} from 'shared/utils/forms'

class PostEditRingHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    _T: PropTypes.func.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.releaseTimeout = undefined
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
        this.releaseTimeout = setTimeout(() => {
          this.setState({ disableSubmit: false })
        }, 0)
      }
    }
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  render () {
    const { dispatch, _T, defaultLocale } = this.props
    const title = _T('title.post')
    const defaultTitle = _T('title.site')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Post
          forceRing
          {...bindActionCreators(PostActions, dispatch)}
          {...bindActionCreators(UploadActions, dispatch)}
          {...bindActionCreators(MapActions, dispatch)}
          {...this.props}
          disableSubmit={this.state.disableSubmit}
          options={PostFormOptions(defaultLocale)}
          regOptions={RegFormOptions(defaultLocale)}
          formType={PostForm(defaultLocale)}
          regFormType={RegForm(defaultLocale)} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.post,
  upload: state.upload,
  map: state.map
}))(connectI18n(locale => ({
  options: PostFormOptions(locale),
  regOptions: RegFormOptions(locale),
  formType: PostForm(locale),
  regFormType: RegForm(locale)
}))(PostEditRingHandler))
