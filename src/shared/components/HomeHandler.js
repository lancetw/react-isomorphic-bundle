import React, { PropTypes } from 'react'
import Home from './HomeComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  auth: state.auth
}))
export default class HomeHandler extends React.Component {

  constructor (props, context) {
    super(props, context)

    const dispatch = context.store.dispatch
    dispatch(updateTitle('title.home'))

    dispatch(AuthActions.sync())
    dispatch(AuthActions.showUser(props.auth.token))
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static propTypes = {
    dispatch: PropTypes.func
  }

  render () {
    const _t = require('counterpart')
    return (
      <DocumentTitle title={_t('title.home')}>
        <Home
          {...this.props}
        />
      </DocumentTitle>
    )
  }

}
