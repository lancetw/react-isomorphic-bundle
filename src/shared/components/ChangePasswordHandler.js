import React, { PropTypes } from 'react'
import ChangePassword from './ChangePasswordComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UserActions from '../actions/UserActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
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
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <ChangePassword
          {...bindActionCreators(UserActions, dispatch)}
          {...this.props}
          defaultLocale={this.getLocale()} />
      </div>
    )
  }
}

export default connect(state => ({
  user: state.user
}))(ChangePasswordHandler)
