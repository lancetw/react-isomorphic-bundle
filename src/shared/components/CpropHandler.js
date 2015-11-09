import React, { PropTypes } from 'react'
import Cprop from './CpropComponent'
import { connect } from 'react-redux'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

class CpropHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch } = this.props
    dispatch(updateTitle('title.cal'))
  }

  render () {
    const title = this._T('title.cprop')
    const defaultTitle = this._T('title.site')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Cprop {...this.props} />
      </div>
    )
  }
}

export default connect(state => ({
}))(CpropHandler)
