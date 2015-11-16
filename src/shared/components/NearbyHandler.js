import React, { Component, PropTypes } from 'react'
import Nearby from './NearbyComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as SearchActions from '../actions/SearchActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { runGeoLoc } from 'shared/utils/geoloc-utils'
import { Loading } from 'shared/components/addon/loading'
import connectI18n from 'shared/components/addon/connect-i18n'

if (process.env.BROWSER) {
  require('css/addon/pin')
  require('css/addon/nearby')
}

class NearbyHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    _T: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.releaseTimeout = undefined
    this.releaseTimeout1 = undefined
    this.releaseTimeout2 = undefined
  }

  componentWillMount () {
    const { dispatch } = this.props

    dispatch(updateTitle('title.nearby'))

    const defaultDistance = 3000
    const center = { lat: 25.018536, lng: 121.529146 }
    dispatch(SearchActions.updateNearbyCenter({ center }))

    if (process.env.BROWSER) {
      runGeoLoc().then((position) => {
        dispatch(SearchActions.nearby({
          dist: defaultDistance,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }, 50)).then((info) => {
          const { pattern } = info
          this.releaseTimeout = setTimeout(() => {
            dispatch(SearchActions.updateNearbyCenter({
              center: { lat: pattern.lat, lng: pattern.lng }
            }))
          }, 500)
        })
      }).catch((err) => {
        // fallback
        dispatch(SearchActions.nearby({
          dist: defaultDistance,
          lat: center.lat,
          lng: center.lng
        }, 50)).then(() => {
          this.releaseTimeout1 = setTimeout(() => {
            dispatch(SearchActions.updateNearbyCenter({ center }))
          }, 500)
        })
      })
    }
  }

  componentDidMount () {
    Loading.show(this.props._T('geoloc.loading'))
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.search.isFetching) {
      this.releaseTimeout2 = setTimeout(() => {
        Loading.hide()
      }, 5000)
    }
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
      clearTimeout(this.releaseTimeout1)
      clearTimeout(this.releaseTimeout2)
    }
  }

  render () {
    const { dispatch, search, _T } = this.props

    const title = _T('title.nearby')
    const defaultTitle = _T('title.site')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Nearby
          {...this.props}
          {...bindActionCreators(SearchActions, dispatch)} />
      </div>
    )
  }
}

export default connect(state => ({
  search: state.search
}))(connectI18n()(NearbyHandler))
