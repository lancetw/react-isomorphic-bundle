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
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.home')}>
        <Home
          {...bindActionCreators(AuthActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }

}
