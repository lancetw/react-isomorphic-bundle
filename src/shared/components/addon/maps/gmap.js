import React, { PropTypes, Component } from 'react'
import GoogleMap from 'google-map-react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import controllable from 'react-controllables'
import counterpart from 'counterpart'
import Pin from './pin'
import { runGeoLoc } from 'shared/utils/geoloc-utils'
import classNames from 'classnames'

let swal
if (process.env.BROWSER) {
  swal = require('sweetalert')
}

@controllable([ 'center', 'zoom', 'hoverKey', 'clickKey' ])
export default class Gmap extends Component {

  static propTypes = {
    defaultCenter: PropTypes.array,
    center: PropTypes.array, // @controllable
    defaultZoom: PropTypes.number,
    zoom: PropTypes.number, // @controllable
    hoverKey: PropTypes.string, // @controllable
    clickKey: PropTypes.string, // @controllable
    onCenterChange: PropTypes.func, // @controllable generated fn
    onZoomChange: PropTypes.func, // @controllable generated fn
    onHoverKeyChange: PropTypes.func, // @controllable generated fn
    onChange: PropTypes.func,
    place: PropTypes.string,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    defaultLocale: PropTypes.string,
    directionMode: PropTypes.bool
  }

  static defaultProps = {
    defaultCenter: [ 25.018536, 121.529146 ],
    center: [ 25.018536, 121.529146 ],
    defaultZoom: 16,
    zoom: 16,
    lat: 25.018536,
    lng: 121.529146,
    className: 'ui segment',
    loading: true,
    directionMode: false
  }

  constructor (props) {
    super(props)

    this.directionsService = null
    this.directionsDisplay = null
    this.state = { showDirections: false }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUnmount () {
    this.directionsService = null
    this.directionsDisplay = null
  }

  _onChange = (event) => {
    const { center, zoom, bounds, marginBounds } = event
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  calculateAndDisplayRoute = (selectedMode, coords) => {
    this.directionsService.route({
      origin: {lat: coords.latitude, lng: coords.longitude},
      destination: {lat: this.props.lat, lng: this.props.lng},
      travelMode: google.maps.TravelMode[selectedMode]
    }, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({ showDirections: true })
        this.directionsDisplay.setDirections(response)
        this.directionsDisplay.setPanel(document.getElementById('directions'))
      } else {
        if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
          swal('查詢失敗', '沒有找到導航路徑', 'error')
        }
        this.directionsDisplay.setDirections({ routes: [] })
        this.setState({ showDirections: false })
        this.directionsDisplay.setPanel(null)
      }
    }.bind(this))
  }

  _onGeoClick = (mode) => {
    if (mode === 'RESET') {
      this.directionsDisplay.setDirections({ routes: [] })
      this.setState({ showDirections: false })
      this.directionsDisplay.setPanel(null)
    } else {
      runGeoLoc().then((position) => {
        this.calculateAndDisplayRoute(mode, position.coords)
      })
    }
  }

  mapInit = ({ map, maps }) => {
    setTimeout(function () {
      google.maps.event.trigger(map, 'resize')
    }, 100)

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
      google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        google.maps.event.trigger(map, 'resize')
      })
    })

    if (this.directionsDisplay === null) {
      this.directionsDisplay = new google.maps.DirectionsRenderer
      this.directionsDisplay.setMap(map)
    }

    if (this.directionsService === null) {
      this.directionsService = new google.maps.DirectionsService
    }
  }

  createMapOptions (maps) {
    return {
      draggable: !('ontouchend' in document),
      mapTypeControlOptions: {
        position: maps.ControlPosition.LEFT_BOTTOM
      }
    }
  }

  /* eslint-disable max-len */
  render () {
    const Translate = require('react-translate-component')

    const directionsClasses = classNames(
      'column',
      'ui',
      'directions',
      { 'segment': this.state.showDirections }
    )

    if (!!this.props.loading) {
      return (
        <div className="ui inverted segment has-header">
          <div className="ui active dimmer">
            <div className="ui small indeterminate text loader">
              <Translate content="wall.loading" />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div id="map" className="ui attached segment">
            <GoogleMap
              onGoogleApiLoaded={this.mapInit}
              yesIWantToUseGoogleMapApiInternals
              ref="gmap"
              options={this.createMapOptions}
              onChange={this._onChange}
              defaultCenter={this.props.defaultCenter}
              center={this.props.center}
              defaultZoom={this.props.defaultZoom}
              zoom={this.props.zoom}>
              <Pin
                lat={this.props.lat}
                lng={this.props.lng}
                place={this.props.place || counterpart('post.map.my')} />
            </GoogleMap>
          </div>
          {this.props.directionMode && (
          <div>
            <div className="tiny ui bottom attached buttons">
              <button
                onClick={this._onGeoClick.bind(null, 'TRANSIT')}
                className="ui icon button"><i className="bus icon"></i></button>
              <button
              onClick={this._onGeoClick.bind(null, 'WALKING')}
              className="ui icon button"><i className="child icon"></i></button>
              <button
                onClick={this._onGeoClick.bind(null, 'DRIVING')}
                className="ui icon button"><i className="car icon"></i></button>
              <button
                onClick={this._onGeoClick.bind(null, 'RESET')}
                className="ui icon button"><i className="ban icon"></i></button>
            </div>
            <div id="directions" className={directionsClasses}></div>
          </div>
          )}
        </div>
      )
    }
  }
}
