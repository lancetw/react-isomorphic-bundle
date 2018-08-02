import React, { Component, PropTypes } from 'react'
import PostDetail from './PostDetailComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import * as MapActions from '../actions/MapActions'
import Helmet from 'react-helmet'
import { tongwenAuto } from 'shared/utils/tongwen'
import { getFileExt, checkImageFile } from 'shared/utils/file-utils'
import connectI18n from 'shared/components/addon/connect-i18n'
import counterpart from 'counterpart'

class PostDetailHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    _T: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.releaseTimeout = undefined
  }

  componentWillMount () {
    const { dispatch } = this.props
    const { store: { resolver } } = this.context

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    this.mapActions = bindActionCreators(MapActions, dispatch)

    resolver.resolve(this.postActions.prepare)
    resolver.resolve(this.mapActions.reload)
    resolver.resolve(this.authActions.showUser, this.props.auth.token)

    const { id } = this.props.params
    if (id) {
      resolver.resolve(this.postActions.loadPostDetail, id)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { id } = nextProps.params
    if (id !== this.props.params.id) {
      const { dispatch } = nextProps
      this.releaseTimeout = setTimeout(() => {
        dispatch(PostActions.loadPostDetail(id))
      }, 0)
    }
  }

  componentDidUpdate () {
    if (counterpart.getLocale() !== 'zh-hant-tw') {
      tongwenAuto(document, this.props.defaultLocale)
    }
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  render () {
    const { dispatch, _T } = this.props
    const { getState } = this.context.store
    const { detail } = getState().post
    const { place } = getState().map
    const protocol = 'https'
    const host = process.env.BROWSER
      ? window.location.host
      : this.context.store.host
    const title = detail.title
    const defaultTitle = _T('title.site')
    const files = typeof detail.file !== 'undefined'
      ? JSON.parse(detail.file)
      : []

    const meta = []
    meta.push({
      'property': 'og:image',
      'content': `${protocol}://${host}/images/oursevents@2x.png`
    })
    files && files.map(function (file) {
      if (checkImageFile(file)) {
        meta.push({
          'property': 'og:image',
          'content': `${protocol}://${host}/uploads/${file}`
        })
      }
    })
    meta.push({ 'property': 'og:type', 'content': 'article' })
    meta.push({ 'property': 'article:publisher', 'content': 'https://www.facebook.com/CCNDA/' })

    const shareInfo = {
      title: place ? `${title} | ${place}` : `${title} | ${defaultTitle}`,
      url: `${protocol}://${host}${this.props.location.pathname}`
    }

    return (
      <div>
        <Helmet
          title={place ? `${title} | ${place}` : `${title} | ${defaultTitle}`} meta={meta} />
        <PostDetail
          {...bindActionCreators(PostActions, dispatch)}
          shareInfo={shareInfo}
          {...this.props} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.post,
  moreList: state.cprop,
  map: state.map
}))(connectI18n()(PostDetailHandler))
