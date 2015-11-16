import React, { Component, PropTypes } from 'react'
import Logout from './LogoutComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import * as CacheActions from '../actions/CacheActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'

class LogoutHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    _T: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch } = this.props
    const { store: { resolver, getState } } = this.context

    dispatch(updateTitle('title.logout'))

    // clear all cache
    this.cacheActions = bindActionCreators(CacheActions, dispatch)
    resolver.resolve(this.cacheActions.clearCache)
  }

  render () {
    const { dispatch, _T } = this.props
    const title = _T('title.logout')
    const defaultTitle = _T('title.site')

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
}))(connectI18n()(LogoutHandler))
