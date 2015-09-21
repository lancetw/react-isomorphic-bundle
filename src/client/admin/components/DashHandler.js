import React, { PropTypes } from 'react'
import Dash from './DashComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from 'client/admin/actions/PostActions'

@connect(state => ({
  auth: state.auth
}))
export default class DashHandler extends React.Component {

  constructor (props, context) {
    super(props)
  }

  render () {
    return (
      <Dash
        {...this.props}
      />
    )
  }
}
