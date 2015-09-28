import React, { PropTypes } from 'react'
import MediaQuery from 'react-responsive'
import Ad from 'shared/components/addon/ad'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AdActions from 'shared/actions/AdActions'
import { isEmpty, find, endsWith } from 'lodash'

class ADContent extends React.Component {

  static propTypes = {
    collect: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch, resolver } = context.store
    this.adActions = bindActionCreators(AdActions, dispatch)
    resolver.resolve(this.adActions.fetchSet)

    this.AdL = null
    this.AdS = null
  }

  componentWillMount () {
    const { collect } = this.props
    this.AdL = this.renderADItem('1L', find(collect))
    this.AdS = this.renderADItem('1S', find(collect))
  }

  componentWillUnmount () {
    this.AdL = null
    this.AdS = null
  }

  renderADItem (size) {
    const { ads } = this.props.collect
    const ad = find(ads, {name: size})
    if (!ad) return (<div></div>)

    const link = ad.script
    return (<Ad size={size} link={link} />)
  }

  render () {
    const { collect } = this.props
    if (!isEmpty(collect)) {
      return (
        <div className="row">
          <div className="ui basic segment center aligned">
            <MediaQuery minDeviceWidth={375}>
              { this.AdL }
            </MediaQuery>
            <MediaQuery maxDeviceWidth={375}>
              { this.AdS }
            </MediaQuery>
          </div>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

export default connect(state => ({
  collect: state.ad
}))(ADContent)
