import React, { Component, PropTypes } from 'react'
import Signup from './SignupComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as SignupActions from '../actions/SignupActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'
import { SignupFormOptions } from 'shared/utils/forms'

class SignupHandler extends Component {

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

    dispatch(updateTitle('title.signup'))

    dispatch(SignupActions.init())
    dispatch(SignupActions.getSiteKey())
  }

  render () {
    const { _T } = this.props
    const title = _T('title.signup')
    const defaultTitle = _T('title.site')
    const { dispatch } = this.props
    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Signup
          {...bindActionCreators(SignupActions, dispatch)}
          {...this.props}
          options={SignupFormOptions(this.props.defaultLocale)} />
      </div>
    )
  }
}

export default connect(state => ({
  signup: state.signup
}))(connectI18n(locale => ({
  options: SignupFormOptions(locale)
}))(SignupHandler))
