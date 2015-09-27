import React, { PropTypes } from 'react'
import Members from './MembersComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from 'client/admin/actions/UserActions'

class MembersHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch } = props
    dispatch(UserActions.fetchList({ offset: 0, limit: 8, status: 0 }))

    this.state = { page: { selected: 0 } }
  }

  handlePageClick (page) {
    const { dispatch, collect } = this.props
    const c = page.selected * collect.limit
    this.setState({ page: page })

    return dispatch(UserActions.fetchList({
      offset: c,
      limit: collect.limit,
      status: 0,
      keyword: collect.keyword
    }))
  }

  blockUsers (checked) {
    const { dispatch } = this.props
    const form = {
      blocked: checked,
      type: 'blocked'
    }

    return dispatch(UserActions.blockUsers(form)).then(() => {
      return this.handlePageClick(this.state.page)
    })
  }

  render () {
    const { dispatch } = this.props
    return (
      <Members
        {...bindActionCreators(UserActions, dispatch)}
        handlePageClick={::this.handlePageClick}
        action={::this.blockUsers}
        menuIndex={1}
        {...this.props}
      />
    )
  }
}

export default connect(state => ({
  collect: state.user
}))(MembersHandler)
