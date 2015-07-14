import React, { PropTypes } from 'react'
import Header from './HeaderComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'

const Translate = require('react-translate-component')

@connect(state => ({
  auth: state.auth
}))
export default class HeaderHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const { dispatch } = this.props
    return (
      <Header
        {...bindActionCreators(AuthActions, dispatch)}
        {...this.props}
      />
    )
  }
}

