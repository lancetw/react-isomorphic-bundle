import React from 'react'
import Header from './HeaderComponent'
import { connect } from 'redux/react'

@connect(state => ({
  auth: state.auth
}))
export default class HeaderHandler extends React.Component {

  render () {
    return (
      <Header
        {...this.props}
      />
    )
  }
}

