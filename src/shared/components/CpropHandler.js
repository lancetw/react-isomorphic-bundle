import React, { PropTypes } from 'react'
import Cprop from './CpropComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'

export default class CpropHandler extends React.Component {

  constructor (props, context) {
    super(props, context)
    const { dispatch, resolver } = context.store
    dispatch(updateTitle('title.cal'))
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    const _t = require('counterpart')
    const { dispatch } = this.props
    return (
      <DocumentTitle title={_t('title.cprop')}>
        <Cprop
          {...this.props}
        />
      </DocumentTitle>
    )
  }
}
