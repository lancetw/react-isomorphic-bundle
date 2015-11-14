import React, { Component, PropTypes } from 'react'
import Dash from './DashComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from 'client/admin/actions/PostActions'
import * as AuthActions from 'client/admin/actions/AuthActions'

class DashHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = { page: { selected: 0 } }
  }

  componentWillMount () {
    const { dispatch } = this.props
    dispatch(PostActions.fetchList({ offset: 0, limit: 8, status: 0 }))
  }

  handlePageClick (page) {
    const { dispatch, collect } = this.props
    const c = page.selected * collect.limit
    this.setState({ page: page })

    return dispatch(PostActions.fetchList({
      offset: c,
      limit: collect.limit,
      status: 0,
      keyword: collect.keyword
    }))
  }

  markAsSpam (checked) {
    const { dispatch } = this.props
    const form = {
      spam: checked,
      type: 'spam'
    }

    return dispatch(PostActions.markAsSpam(form)).then(() => {
      return this.handlePageClick(this.state.page)
    })
  }

  render () {
    const { dispatch } = this.props
    return (
      <Dash
        {...bindActionCreators(AuthActions, dispatch)}
        {...bindActionCreators(PostActions, dispatch)}
        handlePageClick={::this.handlePageClick}
        action={::this.markAsSpam}
        {...this.props}
      />
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  collect: state.post
}))(DashHandler)
