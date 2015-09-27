import React, { PropTypes } from 'react'
import ChangePassword from './ChangePasswordComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from '../actions/UserActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'

class ChangePasswordHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props)

    const { dispatch, resolver } = context.store
    dispatch(updateTitle('title.password'))

    this.userActions = bindActionCreators(UserActions, dispatch)
    resolver.resolve(this.userActions.changePasswordInit)
  }

  render () {
    const title = this._T('title.password')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <ChangePassword
          {...bindActionCreators(UserActions, dispatch)}
          {...this.props}
          defaultLocale={this.getLocale()}
        />
      </DocumentTitle>
    )
  }
}

export default connect(state => ({
  user: state.user
}))(ChangePasswordHandler)
