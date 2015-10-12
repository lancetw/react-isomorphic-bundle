
import React, { PropTypes, Component } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'

const K_WIDTH = 1000
const K_HEIGHT = 50

export default class Pin extends Component {

  static propTypes = {
    place: PropTypes.string
  }

  static defaultProps = {}

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render () {
    return (
      <div>
        <div>
          <div className="red pin has-label"></div>
        </div>
        <div className="pin-label-box">
          { this.props.place
            && <div className="ui orange label with-pin">
            { this.props.place }
          </div> }
        </div>
      </div>
    )
  }
}
