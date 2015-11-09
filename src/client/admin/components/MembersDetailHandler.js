import React, { PropTypes } from 'react'
import MembersDetail from './MembersDetailComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from 'client/admin/actions/UserActions'

class MembersDetailHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    collect: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch, params } = this.props
    const { id } = params
    if (id) {
      dispatch(UserActions.getDetail(id))
    }
  }

  render () {
    const { dispatch } = this.props
    return (
      <MembersDetail
        {...bindActionCreators(UserActions, dispatch)}
        {...this.props}
        menuIndex={1}
      />
    )
  }
}

export default connect(state => ({
  collect: state.user
}))(MembersDetailHandler)
