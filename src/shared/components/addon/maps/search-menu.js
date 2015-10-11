import React, { Component, PropTypes } from 'react'

export default class SearchMenu extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    onDegreeChange: PropTypes.func,
    onPlacesChange: PropTypes.func
  }

  constructor (props) {
    super(props)

    this.searchBox = null
  }

  componentDidMount () {
    const input = React.findDOMNode(this.refs.googlesearch)
    this.searchBox = new google.maps.places.SearchBox(input)
    this.searchBox.addListener('places_changed', this.onPlacesChange)
  }

  onPlacesChange = () => {
    if (this.props.onPlacesChange) {
      this.props.onPlacesChange(this.searchBox.getPlaces())
    }
  }

  onSearchSubmit = (event) => {
    event.preventDefault()
  }

  componentDidUnmount () {
    if (this.searchBox) {
      this.searchBox.removeListener('places_changed', this.onPlacesChange)
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
          <form action="" method="post" onSubmit={this.onSearchSubmit}>
            <div className="ui search">
              <div className="ui icon input">
                <input ref="googlesearch" type="search" placeholder="我的位置" />
                <i className="search icon"></i>
              </div>
              <input type="submit" className="hide-submit" />
            </div>
          </form>
        </div>
      </div>
    )
  }
}
