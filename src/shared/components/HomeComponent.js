import React, { PropTypes } from 'react'
import BaseComponent from 'shared/components/BaseComponent'
import Slider from 'react-slick'
import MediaQuery from 'react-responsive'

export default class HomeComponent extends BaseComponent {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    sync: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  }

  componentWillMount () {
    this.props.sync()
  }

  render () {
    const Translate = require('react-translate-component')
    const TranslateProps = React.createFactory(Translate)
    const tokenProps = {
      component: 'input',
      type: 'text',
      name: 'token',
      scope: 'home_token',
      readOnly: true,
      attributes: {
        placeholder: 'placeholder'
      },
      value: this.props.auth.token
    }
    const settings = {
      autoplay: true,
      autoplaySpeed: 5000,
      dots: false,
      infinite: true,
      speed: 500,
      lazyLoad: true,
      fade: false,
      arrows: false,
      slidesToShow: 1
    }

    return (
      <main className="ui stackable page grid">
        <div className="column">
          <div className="ui segment">
            <h1><Translate content="home.jwt_header" /></h1>
            <div className="ui fluid right labeled left icon input">
              <i className="tags icon"></i>
              {TranslateProps(tokenProps)}
              <div className="ui tag label">
                <Translate content="home.key" />
              </div>
            </div>
          </div>

          <div className="ui basic center aligned header">
            <Slider {...settings}>
              <div>
                <a
                  className="ui centered rounded image"
                  target="_blank"
                  href="http://50-ouendan.mustard.org.tw">
                  <MediaQuery minDeviceWidth={769}>
                    <img
                      alt=""
                      src="images/common/20150522_468x40.gif" />
                  </MediaQuery>
                  <MediaQuery maxDeviceWidth={768}>
                    <img
                      alt=""
                      src="images/common/20150522_335x150.gif" />
                  </MediaQuery>
                </a>
              </div>
              <div>
                <a
                  className="ui centered rounded image"
                  target="_blank"
                  href="http://loveuno.com">
                  <MediaQuery minDeviceWidth={769}>
                    <img
                      alt=""
                      src="images/common/20140930_468x40.jpg" />
                  </MediaQuery>
                  <MediaQuery maxDeviceWidth={768}>
                    <img
                      alt=""
                      src="images/common/20140930_335x150.jpg" />
                  </MediaQuery>
                </a>
              </div>
              <div>
                <a
                  className="ui centered rounded image"
                  target="_blank"
                  href="http://www.taiwanbible.com">
                  <MediaQuery minDeviceWidth={769}>
                    <img
                      alt=""
                      src="images/common/6175.20140408_468x40.gif-550x0.png" />
                  </MediaQuery>
                  <MediaQuery maxDeviceWidth={768}>
                    <img
                      alt=""
                      src="images/common/7026.20140408_335x150.gif-550x0.png" />
                  </MediaQuery>
                </a>
              </div>
            </Slider>
          </div>
        </div>
      </main>
    )
  }
}

