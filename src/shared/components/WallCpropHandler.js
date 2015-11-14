import React, { PropTypes } from 'react'
import WallCprop from './WallCpropComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as PostActions from '../actions/PostActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import counterpart from 'counterpart'
import moment from 'moment'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'
import { BaseComponent } from 'shared/components'

class WallCpropHandler extends BaseComponent {

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

    this.postActions = bindActionCreators(PostActions, dispatch)
    this.authActions = bindActionCreators(AuthActions, dispatch)
    resolver.resolve(this.authActions.showUser, this.props.auth.token)
    const { cprop } = this.props.params

    dispatch(updateTitle(this.getCardProp(cprop)))
    resolver.resolve(this.postActions.cpropList, cprop, 0, 20)
  }

  componentDidMount () {
    counterpart.onLocaleChange(this.handleLocaleChange)
  }

  componentWillUnmount () {
    counterpart.offLocaleChange(this.handleLocaleChange)
  }

  getCardProp = (index) => {
    const _lang = originLocaleName(this.getLocale())
    return at(PostPropArray(_lang), index)
  }

  handleLocaleChange = (newLocale) => {
    moment.locale(fixLocaleName(newLocale))
    this.setState({ locale: newLocale })
  }

  loadFunc = () => {
    const { dispatch, params, post } = this.props
    const { cprop } = params
    dispatch(PostActions.cpropList(cprop, post.offset, post.limit))
  }

  render () {
    const { params } = this.props
    const { cprop } = params
    const defaultTitle = this._T('title.site')
    const title = cprop > 0
      ? this.getCardProp(cprop)
      : this._T('title.wall')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <WallCprop
          {...this.props}
          defaultLocale={this.getLocale()}
          loadFunc={this.loadFunc} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.cprop
}))(WallCpropHandler)
