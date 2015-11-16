import React, { Component, PropTypes } from 'react'
import Cprop from './CpropComponent'
import { updateTitle } from '../actions/LocaleActions'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'

class CpropHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    _T: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch } = this.props
    dispatch(updateTitle('title.cal'))
  }

  render () {
    const { _T } = this.props
    const title = _T('title.cprop')
    const defaultTitle = _T('title.site')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Cprop {...this.props} />
      </div>
    )
  }
}

export default connect()(connectI18n()(CpropHandler))

