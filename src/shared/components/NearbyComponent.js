import React, { PropTypes } from 'react'
import { isEmpty } from 'lodash'
import GoogleMap from 'google-map-react'
import Pin from 'shared/components/addon/maps/pin'
import shouldPureComponentUpdate from 'react-pure-render/function';

if (process.env.BROWSER) {
  require('css/addon/nearby')
}

export default class Nearby extends React.Component {

  static propTypes = {
    search: PropTypes.object.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render () {
    const { pattern, data } = this.props.search
    let Pins
    if (data) {
      Pins = data.map((m) => (
        <Pin
          lat={m.lat}
          lng={m.lng}
          place={m.title} />
      ))
    }

    return (
      <main id="ui container">
        <div id="nearby">
          <GoogleMap
            ref="nearby"
            center={[pattern.lat, pattern.lng]}
            zoom={16}>
            {Pins}
            <Pin
              lat={pattern.lat}
              lng={pattern.lng}
              place={`我的位置`} />
          </GoogleMap>
        </div>
      </main>
    )
  }
}
