import React, { Component, PropTypes } from 'react'
import Login from './LoginComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'
import { LoginFormOptions } from 'shared/utils/forms'

class LoginHandler extends Component {

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
    dispatch(updateTitle('title.login'))
  }

  render () {
    const { dispatch, _T } = this.props
    const title = _T('title.login')
    const defaultTitle = _T('title.site')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Login
          {...bindActionCreators(AuthActions, dispatch)}
          {...this.props}
          options={LoginFormOptions(this.props.defaultLocale)} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth
}))(connectI18n(locale => ({
  options: LoginFormOptions(locale)
}))(LoginHandler))
