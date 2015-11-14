import React, { Component, PropTypes } from 'react'
import Login from './LoginComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from 'client/admin/actions/AuthActions'

class LoginHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
  }

  render () {
    const { dispatch } = this.props
    return (
      <Login
        {...bindActionCreators(AuthActions, dispatch)}
        {...this.props}
      />
    )
  }
}

export default connect(state => ({
  auth: state.auth
}))(LoginHandler)
