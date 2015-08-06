import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import moment from 'moment'
import counterpart from 'counterpart'
import GMap from 'shared/components/addon/maps/gmap'

const { CSSTransitionGroup } = React.addons

export default class Post extends BaseComponent {

  constructor (props) {
    super(props)

    counterpart.onLocaleChange(::this.handleLocaleChange)
    this.releaseTimeout = undefined
  }

  static propTypes = {
    post: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    setPin: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleLocaleChange (newLocale) {

  }

  componentWillUnmount () {
    if (this.op)
      clearTimeout(this.releaseTimeout)
  }

  render () {
    const Translate = require('react-translate-component')
    const { content } = this.props.post

    return (
      <main className="ui two column stackable centered page grid">
        <div className="column">
          <div className="ui fluid card">
            <div className="content">
              <i className="right floated like icon"></i>
              <i className="right floated star icon"></i>
              <div className="header">{content.title}</div>
              <div className="description">
                <p>{content.content}</p>
              </div>
            </div>
            <div className="extra content">
              <span className="left floated like">
                <i className="like icon"></i>
                Like
              </span>
              <span className="right floated star">
                <i className="star icon"></i>
                Favorite
              </span>
            </div>
          </div>
        </div>
        <div className="column">
        { (content.lat && content.lat) &&
          <GMap
            ref="gmap"
            {...this.props.map}
          />
        }
        </div>
      </main>
    )
  }
}

