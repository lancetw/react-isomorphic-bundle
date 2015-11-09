import React, { PropTypes } from 'react'
import Login from './LoginComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AuthActions from '../actions/AuthActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

class LoginHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props) {
    super(props)
  }


  componentWillMount () {
    const { dispatch } = this.props
    dispatch(updateTitle('title.login'))
  }

  render () {
    const title = this._T('title.login')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props
    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Login
          {...bindActionCreators(AuthActions, dispatch)}
          {...this.props}
          defaultLocale={this.getLocale()} />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth
}))(LoginHandler)
