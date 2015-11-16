import React, { Component, PropTypes } from 'react'
import Manage from './ManageComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from '../actions/PostActions'
import * as AuthActions from '../actions/AuthActions'
import * as UserActions from '../actions/UserActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'
import { ManageFormOptions } from 'shared/utils/forms'

class ManageHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    _T: PropTypes.func.isRequired,
    defaultLocale: PropTypes.string.isRequired,
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired
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

    dispatch(updateTitle('title.manage'))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    this.postActions = bindActionCreators(PostActions, dispatch)
    this.userActions = bindActionCreators(UserActions, dispatch)

    resolver.resolve(this.authActions.showUser, this.props.auth.token)
    const user = this.props.auth.user.id
    resolver.resolve(this.postActions.manageList, 0, 20, user)
    resolver.resolve(this.userActions.getInfo, this.props.auth.token)
  }

  loadFunc = () => {
    const { dispatch, auth, post } = this.props
    const user = auth.user.id
    dispatch(PostActions.manageList(post.offset, post.limit, user))
  }

  render () {
    const { dispatch, _T } = this.props
    const title = _T('title.manage')
    const defaultTitle = _T('title.site')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Manage
          {...bindActionCreators(UserActions, dispatch)}
          {...this.props}
          loadFunc={this.loadFunc}
          options={ManageFormOptions(this.props.defaultLocale)} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  post: state.manage,
  user: state.user
}))(connectI18n(locale => ({
  options: ManageFormOptions(locale)
}))(ManageHandler))
