import React, { PropTypes } from 'react'
import { isEmpty, isArray } from 'lodash'
import GoogleMap from 'google-map-react'
import Pin from 'shared/components/addon/maps/pin'
import Marker from 'shared/components/addon/maps/marker'
import SearchMenu from 'shared/components/addon/maps/search-menu'
import shouldPureComponentUpdate from 'react-pure-render/function'
import controllable from 'react-controllables'

@controllable(['zoom', 'hoverKey', 'clickKey'])
export default class Nearby extends React.Component {

  static propTypes = {
    nearby: PropTypes.func.isRequired,
    updateNearbyCenter: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    zoom: PropTypes.number, // @controllable
    hoverKey: PropTypes.string, // @controllable
    clickKey: PropTypes.string, // @controllable
    onZoomChange: PropTypes.func, // @controllable generated fn
    onHoverKeyChange: PropTypes.func, // @controllable generated fn
    onClickKeyChange: PropTypes.func // @controllable generated fn
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  static defaultProps = {
    zoom: 15
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  openInfoWindow = (key, childProps) => {
    this.props.onClickKeyChange(key)
    this.props.updateNearbyCenter({
      center: [ childProps.lat, childProps.lng ]
    })
  }

  handleBoundsChange = (center, zoom) => {
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

  handleChildCloseClick = () => {
    this.props.onClickKeyChange(null)
  }

  handleDegreeChange = (e) => {
    const dist = e.target.getAttribute('value')
    const { pattern } = this.props.search
    this.props.nearby({
      dist: dist ? +dist : 1000,
      lat: pattern.lat,
      lng: pattern.lng
    }, 50)
  }

  handlePlaceChange = (location) => {
    const { pattern, center } = this.props.search
    this.props.nearby({
      dist: pattern.dist ? pattern.dist : 1000,
      lat: location.J,
      lng: location.M
    }, 50).then(() => {
      this.props.updateNearbyCenter({ center: [ location.J, location.M ] })
      this.props.onZoomChange(15)
    })
  }

  createMapOptions (maps) {
    return {
      minZoom: 12,
      zoomControlOptions: {
        position: maps.ControlPosition.RIGHT_CENTER,
        style: maps.ZoomControlStyle.SMALL
      },
      mapTypeControlOptions: {
        position: maps.ControlPosition.LEFT_BOTTOM
      },
      mapTypeControl: true
    };
  }

  render () {
    const { center, key, pattern, data } = this.props.search
    let Markers
    if (data) {
      Markers = data.map((m, index) => (
        <Marker
          lat={m.lat}
          lng={m.lng}
          data={m}
          key={m.id}
          hover={this.props.hoverKey === m.id}
          pulse={!this.props.hoverKey}
          isOpen={m.id === this.props.clickKey}
          handleCloseClick={this.handleChildCloseClick}
          handleTouchStart={this.handleTouchStart}
        />
      ))
    }

    return (
      <main id="ui container">
        <div id="loading-container" />
        <div id="nearby">
          <GoogleMap
            ref="nearby"
            center={center}
            onBoundsChange={this.handleBoundsChange}
            onChildClick={this.handleChildClick}
            onChildMouseEnter={this.handleChildMouseEnter}
            onChildMouseLeave={this.handleChildMouseLeave}
            options={this.createMapOptions}
            zoom={this.props.zoom}>
            <Pin
              lat={pattern.lat}
              lng={pattern.lng} />
            {Markers}
          </GoogleMap>
          <SearchMenu
            onDegreeChange={this.handleDegreeChange}
            onPlaceChange={this.handlePlaceChange}
            placeholder={`我的位置`}
          />
        </div>
      </main>
    )
  }
}
