import React, { Component, PropTypes } from 'react'
import AD from 'react-google-publisher-tag'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AdActions from 'shared/actions/AdActions'
import { isEmpty, find, endsWith } from 'lodash'
import MediaQuery from 'react-responsive'

class ADContent extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch, collect } = this.props
    const { store: { resolver } } = this.context

    this.adActions = bindActionCreators(AdActions, dispatch)
    resolver.resolve(this.adActions.fetchSet)
  }

  componentWillUnmount () {
    this.adActions = null
  }


  render () {
    const path1 = '/1002710/AD200x200'
    const path2 = '/1002710/AD335x150'
    const responsive = false
    const canBeLower = false
    const dimensions1 = [200, 200]
    const dimensions2 = [335, 150]
    return (
      <div className="row">
        <div className="ui basic segment center aligned">
        <MediaQuery maxDeviceWidth={374}>
           <AD path={path1} responsive={responsive} canBeLower={canBeLower}
            dimensions={dimensions1} />
        </MediaQuery>
        <MediaQuery minDeviceWidth={375}>
          <AD path={path2} responsive={responsive} canBeLower={canBeLower}
            dimensions={dimensions2} />
        </MediaQuery>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  collect: state.ad
}))(ADContent)
