import React, { PropTypes } from 'react'
import Cprop from './CpropComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'

export default class CpropHandler extends BaseComponent {

  constructor (props, context) {
    super(props, context)
    const { dispatch, resolver } = context.store
    dispatch(updateTitle('title.cal'))
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  render () {
    const title = this._T('title.home')
    const defaultTitle = this._T('title.cprop')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Cprop
          {...this.props}
        />
      </DocumentTitle>
    )
  }
}
