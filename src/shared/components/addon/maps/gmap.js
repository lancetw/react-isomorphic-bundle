import React, { PropTypes, Component } from 'react'
import GoogleMap from 'google-map-react'
import shouldPureComponentUpdate from 'react-pure-render/function'
import controllable from 'react-controllables'
import counterpart from 'counterpart'
import Pin from './pin'

@controllable([ 'center', 'zoom', 'hoverKey', 'clickKey' ])
export default class Gmap extends Component {

  static propTypes = {
    center: PropTypes.array, // @controllable
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
    className: PropTypes.string,
    defaultLocale: PropTypes.string
  }

  static defaultProps = {
    center: [ 25.018536, 121.529146 ],
    zoom: 16,
    lat: 25.018536,
    lng: 121.529146,
    className: 'ui segment',
    loading: true
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  _onChange = (event) => {
    const { center, zoom, bounds, marginBounds } = event
    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  _onChildClick = (key, childProps) => {
    this.props.onCenterChange([ childProps.lat, childProps.lng ])
  }

  /* eslint-disable max-len */
  render () {
    const Translate = require('react-translate-component')

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
        <div id="map" className={this.props.className}>
          <GoogleMap
            ref="gmap"
            onChange={this._onChange}
            onChildClick={this._onChildClick}
            center={this.props.center}
            zoom={this.props.zoom}>
            <Pin
              lat={this.props.lat}
              lng={this.props.lng}
              place={this.props.place || counterpart('post.map.my')} />
          </GoogleMap>
        </div>
      )
    }
  }
}
