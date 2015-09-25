import React, { PropTypes } from 'react'
import MembersDetail from './MembersDetailComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from 'client/admin/actions/UserActions'

@connect(state => ({
  auth: state.auth,
  collect: state.user
}))
export default class MembersDetailHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch } = props
    dispatch(UserActions.fetch({ hid: 0 }))
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

  render () {
    const { dispatch } = this.props
    return (
      <MembersDetail
        {...bindActionCreators(UserActions, dispatch)}
        menuIndex={1}
        {...this.props}
      />
    )
  }
}
