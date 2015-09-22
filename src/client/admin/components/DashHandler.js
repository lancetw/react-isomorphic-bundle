import React, { PropTypes } from 'react'
import Dash from './DashComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as PostActions from 'client/admin/actions/PostActions'
import * as AuthActions from 'client/admin/actions/AuthActions'

@connect(state => ({
  auth: state.auth,
  post: state.post
}))
export default class DashHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch } = props
    dispatch(PostActions.fetchList(0, 5, null, null, 0))
  }

  handlePageClick (page) {
    const { dispatch } = this.props
    const c = page.selected * this.props.post.limit
    dispatch(PostActions.fetchList(c, this.props.post.limit, null, null, 0))
  }

  markAsSpam () {

  }

  render () {
    const { dispatch } = this.props
    return (
      <Dash
        {...bindActionCreators(AuthActions, dispatch)}
        handlePageClick={::this.handlePageClick}
        markAsSpam={this.markAsSpam}
        {...this.props}
      />
    )
  }
}
