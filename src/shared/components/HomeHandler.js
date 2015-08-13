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
    const { dispatch, resolver } = context.store

    dispatch(updateTitle('title.home'))

    this.authActions = bindActionCreators(AuthActions, dispatch)
    resolver.resolve(this.authActions.sync)
    resolver.resolve(this.authActions.showUser, props.auth.token)
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
