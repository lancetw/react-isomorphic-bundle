import React, { PropTypes } from 'react'
import ChangePassword from './ChangePasswordComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'redux/react'
import * as UserActions from '../actions/UserActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  user: state.user
}))
export default class ChangePasswordHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.password')}>
        <ChangePassword
          {...bindActionCreators(UserActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }

}
