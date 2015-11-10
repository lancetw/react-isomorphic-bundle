import React, { PropTypes } from 'react'
import Wall from './WallComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'
import { BaseComponent } from 'shared/components'

class WallHandler extends BaseComponent {

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

    this.state = {
      locale: fixLocaleName(this.getLocale())
    }
  }

  componentWillMount () {
    const { dispatch } = this.props
    const { store: { resolver } } = this.context

    this.postActions = bindActionCreators(PostActions, dispatch)
    this.authActions = bindActionCreators(AuthActions, dispatch)
    resolver.resolve(this.authActions.showUser, this.props.auth.token)
    const { cprop } = this.props.params

    dispatch(updateTitle('title.wall'))
    resolver.resolve(this.postActions.overviewList, 0, 20)
  }

  getCardProp (index) {
    const _lang = originLocaleName(this.getLocale())
    return at(PostPropArray(_lang), index)
  }

  loadFunc () {
    const { dispatch, params, post } = this.props
    const { cprop } = params
    dispatch(PostActions.overviewList(post.offset, post.limit))
  }

  render () {
    const { params } = this.props
    const { cprop } = params
    const defaultTitle = this._T('title.site')
    const title = cprop > 0
      ? ::this.getCardProp(cprop) + this._T('title.wall_cprop')
      : this._T('title.wall')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Wall
          {...this.props}
          defaultLocale={this.getLocale()}
          loadFunc={::this.loadFunc} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.overview
}))(WallHandler)
