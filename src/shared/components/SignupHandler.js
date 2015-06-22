import React, { PropTypes } from 'react'
import Signup from './SignupComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'redux/react'
import * as SignupActions from '../actions/SignupActions'
import * as AuthActions from '../actions/AuthActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  signup: state.signup,
  auth: state.auth
}))
export default class SignupHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const { dispatch } = this.props
    return (
      <DocumentTitle title='Sign up'>
        <Signup
          {...bindActionCreators(SignupActions, dispatch)}
          {...bindActionCreators(AuthActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }

}
