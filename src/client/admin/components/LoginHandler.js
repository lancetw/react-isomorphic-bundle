import React, { PropTypes } from 'react'
import Login from './LoginComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from 'client/admin/actions/AuthActions'

@connect(state => ({
  auth: state.auth
}))
export default class LoginHandler extends React.Component {

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
