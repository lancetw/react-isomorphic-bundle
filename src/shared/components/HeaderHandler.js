import React, { PropTypes } from 'react'
import Header from './HeaderComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from 'shared/actions/AuthActions'
import * as SearchActions from 'shared/actions/SearchActions'

class HeaderHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
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

export default connect(state => ({
  auth: state.auth,
  search: state.search
}))(HeaderHandler)
