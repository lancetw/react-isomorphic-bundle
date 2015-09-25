import React, { PropTypes } from 'react'
import Blocked from './BlockedComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from 'client/admin/actions/UserActions'
import * as AuthActions from 'client/admin/actions/AuthActions'

@connect(state => ({
  auth: state.auth,
  collect: state.user
}))
export default class BlockedHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch } = props
    dispatch(UserActions.fetchList({ offset: 0, limit: 8, status: 1 }))

    this.state = { page: { selected: 0 } }
  }

  handlePageClick (page) {
    const { dispatch, collect } = this.props
    const c = page.selected * collect.limit
    this.setState({ page: page })

    return dispatch(UserActions.fetchList({
      offset: c,
      limit: collect.limit,
      status: 1,
      keyword: collect.keyword
    }))
  }

  unblockUsers (checked) {
    const { dispatch } = this.props
    const form = {
      blocked: checked,
      type: 'unblocked'
    }

    return dispatch(UserActions.blockUsers(form)).then(() => {
      return this.handlePageClick(this.state.page)
    })
  }

  render () {
    const { dispatch } = this.props
    return (
      <Blocked
        {...bindActionCreators(AuthActions, dispatch)}
        {...bindActionCreators(UserActions, dispatch)}
        handlePageClick={::this.handlePageClick}
        action={::this.unblockUsers}
        menuIndex={1}
        {...this.props}
      />
    )
  }
}
