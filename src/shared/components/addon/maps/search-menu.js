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

  componentDidUnmount () {
    if (this.searchBox) {
      this.searchBox.removeListener('place_changed', this.onPlaceChange)
    }
  }

  render () {
    return (
      <div className="ui grid">
        <div className="ui serachbox computer tablet only row">
          <div className="ui compact small menu">
            <div className="ui simple dropdown item">
              搜尋範圍
              <i className="dropdown icon"></i>
              <div className="menu">
                <div onClick={this.props.onDegreeChange} value="1000" className="item">1 公里</div>
                <div onClick={this.props.onDegreeChange} value="3000" className="item">3 公里</div>
                <div onClick={this.props.onDegreeChange} value="5000" className="item">5 公里</div>
                <div onClick={this.props.onDegreeChange} value="10000" className="item">10 公里</div>
                <div onClick={this.props.onDegreeChange} value="20000" className="item">20 公里</div>
                <div onClick={this.props.onDegreeChange} value="50000" className="item">50 公里</div>
              </div>
            </div>
          </div>
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
