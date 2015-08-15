import React, { PropTypes } from 'react'
import Header from './HeaderComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from 'shared/actions/AuthActions'
import * as SearchActions from 'shared/actions/SearchActions'

const Translate = require('react-translate-component')

@connect(state => ({
  auth: state.auth,
  search: state.search
}))
export default class HeaderHandler extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const { dispatch } = this.props
    return (
      <Header
        {...bindActionCreators(AuthActions, dispatch)}
        {...bindActionCreators(SearchActions, dispatch)}
        {...this.props}
      />
    )
  }
}

