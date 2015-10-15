import React, { PropTypes } from 'react'
import Logout from './LogoutComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as CacheActions from '../actions/CacheActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

class LogoutHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props)

    const {dispatch, resolver} = context.store
    dispatch(updateTitle('title.logout'))

    // clear all cache
    this.cacheActions = bindActionCreators(CacheActions, dispatch)
    resolver.resolve(this.cacheActions.clearCache)
  }

  render () {
    const title = this._T('title.logout')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props
    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Logout
          {...bindActionCreators(AuthActions, dispatch)}
          {...this.props} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth
}))(LogoutHandler)
