import React, { PropTypes } from 'react'
import Cprop from './CpropComponent'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

export default class CpropHandler extends BaseComponent {

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
