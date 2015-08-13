import React, { PropTypes } from 'react'
import Signup from './SignupComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as SignupActions from '../actions/SignupActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

@connect(state => ({
  signup: state.signup
}))
export default class SignupHandler extends React.Component {

  constructor (props, context) {
    super(props, context)
    const { dispatch } = context.store
    dispatch(updateTitle('title.signup'))

    dispatch(SignupActions.init())
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.signup')}>
        <Signup
          {...bindActionCreators(SignupActions, dispatch)}
          {...this.props}
        />
      </DocumentTitle>
    )
  }

}
