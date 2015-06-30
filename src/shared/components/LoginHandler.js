import React, { PropTypes } from 'react'
import Login from './LoginComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'redux/react'
import * as AuthActions from '../actions/AuthActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  auth: state.auth
}))
export default class LoginHandler extends React.Component {

  constructor (props, context) {
    super(props, context)

    const dispatch = context.redux.dispatch
    dispatch(updateTitle('title.login'))
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    redux: PropTypes.object.isRequired
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.login')}>
        <Login
          {...bindActionCreators(AuthActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }
}
