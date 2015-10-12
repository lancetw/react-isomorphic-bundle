import React, { Component, PropTypes } from 'react'
import { isArray } from 'lodash'

export default class SearchMenu extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    onDegreeChange: PropTypes.func,
    onPlaceChange: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.autocomplete = null
    this.timer = null
    this.state = { value: '' }
  }

  componentDidMount () {
    const input = React.findDOMNode(this.refs.googlesearch)
    this.autocomplete = new google.maps.places.Autocomplete(input)
    this.autocomplete.addListener('place_changed', this.onPlaceChange)
  }

  componentWillUnmount () {
    if (this.searchBox) {
      this.searchBox.removeListener('place_changed', this.onPlaceChange)
    }
  }

  onPlaceChange = () => {
    const place = this.autocomplete.getPlace()
    if (this.props.onPlaceChange) {
      if (place.geometry) {
        const { location } = place.geometry
        this.props.onPlaceChange(location)
        this.setState({ value: place.name })
      }
    }
  }

  handleChange = () => {
    const value = React.findDOMNode(this.refs.simplesearch).value
    this.setState({ value })
  }

  handleSimpleSubmit = (event) => {
    event.preventDefault()
    const input = React.findDOMNode(this.refs.simplesearch)
    input.blur()
    const value = input.value
    const geocoder = new google.maps.Geocoder()
    const self = this.props
    geocoder.geocode({ address: value }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        const { location } = results[0].geometry
        self.onPlaceChange(location)
      }
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    this.doSubmit()
  }

  doSubmit () {
    const input = React.findDOMNode(this.refs.googlesearch)
    google.maps.event.trigger(input, 'focus')
    google.maps.event.trigger(input, 'keydown', { keyCode: 40 })
    google.maps.event.trigger(input, 'keydown', { keyCode: 13 })
    google.maps.event.trigger(input, 'keydown', { keyCode: 13 })
  }

  render () {
    const Translate = require('react-translate-component')

    const DegreeMenu = (
      <div className="ui compact small menu">
        <div className="ui simple dropdown item">
          <Translate content="geoloc.range.text" />
          <i className="dropdown icon"></i>
          <div className="menu">
            <div
              onClick={this.props.onDegreeChange.bind(null, 3000)}
              className="item">
              <Translate content="geoloc.range.lv1" />
            </div>
            <div
              onClick={this.props.onDegreeChange.bind(null, 5000)}
              className="item">
              <Translate content="geoloc.range.lv2" />
            </div>
            <div
              onClick={this.props.onDegreeChange.bind(null, 10000)}
              className="item">
              <Translate content="geoloc.range.lv3" />
            </div>
            <div
              onClick={this.props.onDegreeChange.bind(null, 20000)}
              className="item">
              <Translate content="geoloc.range.lv4" />
            </div>
            <div
              onClick={this.props.onDegreeChange.bind(null, 50000)}
              className="item">
              <Translate content="geoloc.range.lv5" />
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className="ui grid">
        <div className="ui mini serachbox mobile only row">
          { DegreeMenu }
        </div>
        <div className="ui serachbox computer tablet only row">
          { DegreeMenu }
          <div className="ui search simple">
            <form
              action=""
              method="get"
              onSubmit={this.handleSimpleSubmit}>
              <div className="ui icon input">
                <input
                  ref="simplesearch"
                  type="input"
                  placeholder={this.props.placeholder}
                  onChange={this.handleChange}
                  value={this.state.value} />
                <i className="compass icon"></i>
              </div>
              <input type="submit" className="hide-submit" />
            </form>
          </div>
          <div className="ui search autocomplete">
            <form
              action=""
              method="get"
              onSubmit={this.handleSubmit}>
              <div className="ui icon input">
                <input
                  ref="googlesearch"
                  type="input"
                  placeholder={this.props.placeholder}
                  onChange={this.handleChange} />
                <i className="compass icon"></i>
              </div>
              <input type="submit" className="hide-submit" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
