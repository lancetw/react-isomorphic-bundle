import React, { Component, PropTypes } from 'react'
import ChangePassword from './ChangePasswordComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from '../actions/UserActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'
import { ChangePasswordFormOptions } from 'shared/utils/forms'

class ChangePasswordHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    _T: PropTypes.func.isRequired,
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
    const { store: { resolver, getState } } = this.context

    dispatch(updateTitle('title.password'))

    this.userActions = bindActionCreators(UserActions, dispatch)
    resolver.resolve(this.userActions.changePasswordInit)
  }

  render () {
    const { dispatch, _T } = this.props
    const title = _T('title.password')
    const defaultTitle = _T('title.site')
    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <ChangePassword
          {...bindActionCreators(UserActions, dispatch)}
          {...this.props}
          options={ChangePasswordFormOptions(this.props.defaultLocale)} />
      </div>
    )
  }
}

export default connect(state => ({
  user: state.user
}))(connectI18n(locale => ({
  options: ChangePasswordFormOptions(locale)
}))(ChangePasswordHandler))
