import React, { Component, PropTypes } from 'react'
import WallCprop from './WallCpropComponent'
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

class WallCpropHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    _T: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
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

    dispatch(updateTitle(this.getCardProp(cprop)))
    resolver.resolve(this.postActions.cpropList, cprop, 0, 20)
  }

  getCardProp = (index) => {
    const _lang = originLocaleName(this.props.defaultLocale)
    return at(PostPropArray(_lang), index)
  }

  loadFunc = () => {
    const { dispatch, params, post } = this.props
    const { cprop } = params
    dispatch(PostActions.cpropList(cprop, post.offset, post.limit))
  }

  render () {
    const { _T, params } = this.props
    const { cprop } = params
    const defaultTitle = _T('title.site')
    const title = cprop > 0
      ? this.getCardProp(cprop)
      : _T('title.wall')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <WallCprop
          {...this.props}
          loadFunc={this.loadFunc} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.cprop
}))(connectI18n()(WallCpropHandler))
