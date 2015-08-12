import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import { toShortDate } from 'shared/utils/date-utils'
import { getFileExt } from 'shared/utils/file-utils'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import counterpart from 'counterpart'
import moment from 'moment'

export default class PostCard extends BaseComponent {

  static propTypes = {
    data: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      locale: this.fixLocaleName(counterpart.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  handleLocaleChange (newLocale) {
    const locale = this.fixLocaleName(newLocale)
    moment.locale(locale)
    this.setState({ locale })
  }

  fixLocaleName (locale) {
    if (locale === 'zh-hant-tw')
      return 'zh-TW'

    return locale
  }

  originLocaleName (locale) {
    if (locale === 'zh-TW')
      return 'zh-hant-tw'

    return locale
  }

  getCardProp (index) {
    return at(PostPropArray(this.originLocaleName(this.state.locale)), index)
  }

  /* eslint-disable max-len */
  render () {
    const card = this.props.data
    const files = JSON.parse(card.file)

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
              : `未提供位置資訊` }
          </span>
        </div>
      </div>
    )
  }
}
