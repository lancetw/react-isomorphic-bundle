
import React, { PropTypes, Component } from 'react'
import shouldPureComponentUpdate from 'react-pure-render/function'

const K_WIDTH = 1800
const K_HEIGHT = 100

const Pintyle = {
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,

  backgroundImage: '/images/marker.png',
  textAlign: 'center',
  color: '#000',
  fontSize: 18,
  fontWeight: 'bold',
  padding: 2
}

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
      <div style={Pintyle}>
        <div>
          <img alt="" src={'/images/marker.png'} />
        </div>
        <div className="ui orange pointing label">{ this.props.place }</div>
      </div>
    )
  }
}
