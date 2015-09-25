import React, { PropTypes } from 'react'
import Disabled from './DisabledComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AdminActions from 'client/admin/actions/AdminActions'
@connect(state => ({
  auth: state.auth,
  collect: state.admin
}))
export default class DisabledHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch } = props
    dispatch(AdminActions.fetchList({ offset: 0, limit: 8, status: 1 }))

    this.state = { page: { selected: 0 } }
  }

  handlePageClick (page) {
    const { dispatch, collect } = this.props
    const c = page.selected * collect.limit
    this.setState({ page: page })

    return dispatch(AdminActions.fetchList({
      offset: c,
      limit: collect.limit,
      status: 1,
      keyword: collect.keyword
    }))
  }

  blockAdmins (checked) {
    const { dispatch } = this.props
    const form = {
      blocked: checked,
      type: 'unblocked'
    }

    return dispatch(AdminActions.blockAdmins(form)).then(() => {
      return this.handlePageClick(this.state.page)
    })
  }

  render () {
    const { dispatch } = this.props
    return (
      <Disabled
        {...bindActionCreators(AdminActions, dispatch)}
        handlePageClick={::this.handlePageClick}
        action={::this.blockAdmins}
        menuIndex={3}
        {...this.props}
      />
    )
  }
}
