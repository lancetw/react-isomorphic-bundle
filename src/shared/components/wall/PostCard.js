import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { Link } from 'react-router'
import { toShortDate } from 'shared/utils/date-utils'
import { postPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import counterpart from 'counterpart'
import moment from 'moment'
import { fixLocaleName, originLocaleName } from 'shared/utils/locale-utils'

export default class PostCard extends BaseComponent {

  static propTypes = {
    data: PropTypes.object,
    defaultLocale: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)

    counterpart.setLocale(props.defaultLocale)

    this.state = {
      locale: fixLocaleName(counterpart.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  getCardProp (index) {
    return at(postPropArray(originLocaleName(this.state.locale)), index)
  }
  /* eslint-disable max-len */
  render () {
    const Translate = require('react-translate-component')

    const card = this.props.data

    const eventDate = (card.startDate === card.endDate)
    ? toShortDate(card.endDate)
    : toShortDate(card.startDate) + ' - ' + toShortDate(card.endDate)

    const cardProp = this.getCardProp(card.prop)

    return (
      <div className="ui fluid orange post card">
        <div className="content">
          <div className="header">
            <Link to={`/wall/posts/${card.id}`}>{card.title}</Link>
          </div>
          <div className="meta">
            <span className="ui orange label large right floated time">
              {eventDate}
            </span>
            <span className="ui tag label category">{cardProp}</span>
          </div>
        </div>
        <div className="extra content">
          <span className="left floated">
          </span>
          <span className="right floated like">
            <i className="like icon"></i>
            { card.place ? (
                <a target="_blank" href={`http://maps.google.com/maps?z=18&q=${card.lat},${card.lng}`}>{card.place}</a>
              )
              : <Translate content="post.detail.nomap" /> }
          </span>
        </div>
      </div>
    )
  }

  handleLocaleChange (newLocale) {
    if (process.env.BROWSER) {
      const locale = fixLocaleName(newLocale)
      moment.locale(locale)
      this.setState({ locale })
    }
  }
}
