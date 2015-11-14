import React, { Component, PropTypes } from 'react'
import Permissions from './PermissionsComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AdminActions from 'client/admin/actions/AdminActions'
import * as AuthActions from 'client/admin/actions/AuthActions'
import { contains } from 'lodash'

let swal
if (process.env.BROWSER) {
  swal = require('sweetalert')
}

class PermissionsHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = { page: { selected: 0 } }
  }

  componentWillMount () {
    const { dispatch } = this.props
    dispatch(AdminActions.fetchList({ offset: 0, limit: 8, status: 0 }))
  }

  handlePageClick (page) {
    const { dispatch, collect } = this.props
    const c = page.selected * collect.limit
    this.setState({ page: page })

    return dispatch(AdminActions.fetchList({
      offset: c,
      limit: collect.limit,
      status: 0,
      keyword: collect.keyword
    }))
  }

  blockAdmins (checked) {
    const { dispatch } = this.props
    const form = {
      blocked: checked,
      type: 'blocked'
    }

    const token = AuthActions.getToken()
    return dispatch(AuthActions.showUser(token)).then(() => {
      const { user } = this.props.auth
      if (contains(checked, user.id)) {
        swal('Oops...', '不應該停用自己。', 'error')
        return Promise.reject('Oops')
      } else {
        return dispatch(AdminActions.blockAdmins(form)).then(() => {
          return this.handlePageClick(this.state.page)
        })
      }
    })
  }

  render () {
    const { dispatch } = this.props
    return (
      <Permissions
        {...bindActionCreators(AdminActions, dispatch)}
        handlePageClick={::this.handlePageClick}
        action={::this.blockAdmins}
        menuIndex={3}
        {...this.props}
      />
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  collect: state.admin
}))(PermissionsHandler)
