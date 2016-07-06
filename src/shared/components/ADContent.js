import React, { Component, PropTypes } from 'react'
import MediaQuery from 'react-responsive'
// import Ad from 'shared/components/addon/ad'
import AD from 'react-google-publisher-tag'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AdActions from 'shared/actions/AdActions'
import { isEmpty, find, endsWith } from 'lodash'

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

  renderADItem = (size) => {
    const { ads } = this.props.collect
    const ad = find(ads, { name: size })
    if (!ad) return (<div></div>)

    const path = ad.script
    return (<AD path={path} />)
  }

  render () {
    const { collect } = this.props
    if (collect && !isEmpty(collect.ads)) {
      return (
        <div className="row">
          <div className="ui basic segment center aligned">
            { this.renderADItem('1S', find(collect)) }
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
