import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DocumentTitle from 'shared/components/addon/document-title'

@connect(state => ({
}))
export default class DashHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <DocumentTitle title="test">
        <div>Dash :)</div>
      </DocumentTitle>
    )
  }

}
