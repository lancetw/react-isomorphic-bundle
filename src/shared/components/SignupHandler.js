import React, { PropTypes } from 'react'
import Signup from './SignupComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as SignupActions from '../actions/SignupActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

class SignupHandler extends BaseComponent {

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

    dispatch(updateTitle('title.signup'))

    dispatch(SignupActions.init())
    dispatch(SignupActions.getSiteKey())
  }

  render () {
    const title = this._T('title.signup')
    const defaultTitle = this._T('title.site')
    const { dispatch } = this.props
    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Signup
          {...bindActionCreators(SignupActions, dispatch)}
          {...this.props}
          defaultLocale={this.getLocale()} />
      </div>
    )
  }
}

export default connect(state => ({
  signup: state.signup
}))(SignupHandler)
