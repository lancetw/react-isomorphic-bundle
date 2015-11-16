import React, { Component, PropTypes } from 'react'
import Wall from './WallComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import { originLocaleName } from 'shared/utils/locale-utils'
import connectI18n from 'shared/components/addon/connect-i18n'

class WallHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    _T: PropTypes.func.isRequired,
    defaultLocale: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
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

  getCardProp = (index) => {
    const _lang = originLocaleName(this.props.defaultLocale)
    return at(PostPropArray(_lang), index)
  }

  loadFunc = () => {
    const { dispatch, params, post } = this.props
    const { cprop } = params
    dispatch(PostActions.overviewList(post.offset, post.limit))
  }

  render () {
    const { params, _T } = this.props
    const { cprop } = params
    const defaultTitle = _T('title.site')
    const title = cprop > 0
      ? this.getCardProp(cprop) + this._T('title.wall_cprop')
      : _T('title.wall')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Wall
          {...this.props}
          loadFunc={this.loadFunc} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.overview
}))(connectI18n()(WallHandler))
