import React, { PropTypes } from 'react'
import Login from './LoginComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'

class LoginHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props)

    const { dispatch } = context.store
    dispatch(updateTitle('title.login'))
  }

  render () {
    const title = this._T('title.login')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Login
          {...bindActionCreators(AuthActions, dispatch)}
          {...this.props}
          defaultLocale={this.getLocale()}
        />
      </DocumentTitle>
    )
  }
}

export default connect(state => ({
  auth: state.auth
}))(LoginHandler)
