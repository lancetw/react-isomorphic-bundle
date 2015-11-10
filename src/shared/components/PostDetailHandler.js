import React, { PropTypes } from 'react'
import PostDetail from './PostDetailComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import * as MapActions from '../actions/MapActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'
import { tongwenAuto } from 'shared/utils/tongwen'
import { getFileExt } from 'shared/utils/file-utils'

class PostDetailHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
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
      setTimeout(() => {
        dispatch(PostActions.loadPostDetail(id))
      }, 0)
    }
  }

  componentDidUpdate () {
    tongwenAuto(document, this.getLocale())
  }

  render () {
    const { dispatch } = this.props
    const { getState } = this.context.store
    const { detail } = getState().post
    const protocol = process.env.BROWSER
      ? window.location.protocol
      : this.context.store.protocol
    const host = process.env.BROWSER
      ? window.location.host
      : this.context.store.host
    const title = detail.title
    const defaultTitle = this._T('title.site')
    const files = typeof detail.file !== 'undefined'
      ? JSON.parse(detail.file)
      : []

    const meta = []
    files && files.map(function (file) {
      if (getFileExt(file) !== 'pdf') {
        meta.push({
          'property': 'og:image',
          'content': `${protocol}://${host}/uploads/${file}`
        })
      }
    })

    meta.push({ 'property': 'og:type', 'content': 'article' })

    return (
      <div>
        <Helmet
          title={`${title} | ${defaultTitle}`} meta={meta} />
        <PostDetail
          {...bindActionCreators(PostActions, dispatch)}
          {...this.props}
          defaultLocale={this.getLocale()} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.post,
  moreList: state.cprop,
  map: state.map
}))(PostDetailHandler)
