import React, { Component, PropTypes } from 'react'
import { isEmpty, isArray } from 'lodash'
import GoogleMap from 'google-map-react'
import Pin from 'shared/components/addon/maps/pin'
import Marker from 'shared/components/addon/maps/marker'
import SearchMenu from 'shared/components/addon/maps/search-menu'
import shouldPureComponentUpdate from 'react-pure-render/function'
import controllable from 'react-controllables'
import { isFinite } from 'lodash'

@controllable(['zoom', 'hoverKey', 'clickKey'])
export default class Nearby extends Component {

  static propTypes = {
    nearby: PropTypes.func.isRequired,
    updateNearbyCenter: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    defaultCenter: PropTypes.object.isRequired,
    center: PropTypes.object,
    defaultZoom: PropTypes.number.isRequired,
    defaultLocale: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    zoom: PropTypes.number, // @controllable
    hoverKey: PropTypes.any, // @controllable
    clickKey: PropTypes.any, // @controllable
    onZoomChange: PropTypes.func, // @controllable generated fn
    onHoverKeyChange: PropTypes.func, // @controllable generated fn
    onClickKeyChange: PropTypes.func // @controllable generated fn
  }

  static defaultProps = {
    defaultCenter: { lat: 25.0318808, lng: 121.5193721 },
    defaultZoom: 14,
    center: { lat: 25.0318808, lng: 121.5193721 },
    zoom: 14
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  openInfoWindow = (key, childProps) => {
    this.props.onClickKeyChange(key)
    this.props.updateNearbyCenter({
      center: { lat: childProps.lat, lng: childProps.lng }
    })
  }

  handleChange = (event) => {
    const { center, zoom, bounds, marginBounds } = event
    this.props.updateNearbyCenter({ center })
    this.props.onZoomChange(zoom)
  }

  handleTouchStart = (key, childProps) => {
    return this.openInfoWindow(key, childProps)
  }

  handleChildClick = (key, childProps) => {
    return this.openInfoWindow(key, childProps)
  }

  handleChildMouseEnter = (key, childProps) => {
    this.props.onHoverKeyChange(key)
  }

  handleChildMouseLeave = () => {
    this.props.onHoverKeyChange(null)
  }

  handleChildGoClick = (mid) => {
    this.props.history.replaceState({}, `/w/${mid}`)
  }

  handleChildCloseClick = () => {
    this.props.onClickKeyChange(null)
  }

  handleDegreeChange = (dist) => {
    const { pattern } = this.props.search
    if (pattern) {
      this.props.nearby({
        dist: isFinite(+dist) ? +dist : 1000,
        lat: pattern.lat,
        lng: pattern.lng
      }, 50)
    }
  }

  handlePlaceChange = (location) => {
    if (!location) return
    const { pattern, center } = this.props.search
    this.props.nearby({
      dist: pattern.dist ? pattern.dist : 1000,
      lat: location.lat(),
      lng: location.lng()
    }, 50).then(() => {
      this.props.updateNearbyCenter({
        center: { lat: location.lat(), lng: location.lng() }
      })
      this.props.onZoomChange(14)
    })
  }

  createMapOptions (maps) {
    return {
      minZoom: 11,
      fullscreenControl: false,
      zoomControlOptions: {
        position: maps.ControlPosition.RIGHT_CENTER,
        style: maps.ZoomControlStyle.SMALL
      },
      mapTypeControlOptions: {
        position: maps.ControlPosition.LEFT_BOTTOM
      },
      mapTypeControl: true,
      draggable: true
    };
  }

  render () {
    const { center, pattern, data } = this.props.search
    let MyPlace
    if (typeof pattern.lat !== 'undefined'
        && typeof pattern.lng !== 'undefined') {
      MyPlace = (<Pin {...pattern} />)
    } else {
      MyPlace = (<Pin {...this.props.center} />)
    }

    let Markers
    if (data) {
      Markers = data.map((m) => (
        <Marker
          lat={m.lat}
          lng={m.lng}
          data={m}
          key={m.id}
          hover={this.props.hoverKey === m.id}
          pulse={!this.props.hoverKey}
          isOpen={this.props.clickKey === m.id}
          handleGoClick={this.handleChildGoClick.bind(null, m.id)}
          handleCloseClick={this.handleChildCloseClick}
          handleTouchStart={this.handleTouchStart}
          defaultLocale={this.props.defaultLocale}
        />
      ))
    }

    return (
      <main id="ui container">
        <div id="loading-container" />
        <div id="nearby">
          <GoogleMap
            onGoogleApiLoaded={({ map, maps }) => {}}
            yesIWantToUseGoogleMapApiInternals
            ref="nearby"
            defaultCenter={this.props.defaultCenter}
            center={center}
            onChange={this.handleChange}
            onChildClick={this.handleChildClick}
            onChildMouseEnter={this.handleChildMouseEnter}
            onChildMouseLeave={this.handleChildMouseLeave}
            options={this.createMapOptions}
            hoverDistance={42}
            defaultZoom={this.props.defaultZoom}
            zoom={this.props.zoom}>
            {Markers}
            {MyPlace}
          </GoogleMap>
          <SearchMenu
            onDegreeChange={this.handleDegreeChange}
            onPlaceChange={this.handlePlaceChange}
            placeholder={``}
          />
        </div>
      </main>
    )
  }
}
