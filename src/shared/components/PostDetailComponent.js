import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import GMap from 'shared/components/addon/maps/gmap'
import { isEmpty } from 'lodash'
import { toShortDate } from 'shared/utils/date-utils'
import { getFileExt } from 'shared/utils/file-utils'
import classNames from 'classnames'
import MediaQuery from 'react-responsive'
import Ad from 'shared/components/addon/ad'
import { PostPropArray } from 'shared/utils/forms'
import { at } from 'lodash'
import counterpart from 'counterpart'
import moment from 'moment'

const { CSSTransitionGroup } = React.addons

export default class Post extends BaseComponent {

  constructor (props) {
    super(props)

    this.state = {
      locale: this.fixLocaleName(counterpart.getLocale())
    }

    counterpart.onLocaleChange(::this.handleLocaleChange)
    this.releaseTimeout = undefined
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
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

  getDetailProp (index) {
    return at(PostPropArray(this.originLocaleName(this.state.locale)), index)
  }

  componentWillUnmount () {
    if (this.op)
      clearTimeout(this.releaseTimeout)
  }

  render () {
    const Translate = require('react-translate-component')
    const { detail } = this.props.post
    const { content } = detail
    const files = typeof detail.file !== 'undefined'
      ? JSON.parse(detail.file)
      : []

    const detailClass = detail.id
      ? classNames('content')
      : classNames('content', 'hide')

    const finalContent = content && content.split('\n').map((t) => {
      return t === '' ? <br /> : <p>{t}</p>
    })

    const eventDate = (detail.startDate === detail.endDate)
    ? toShortDate(detail.endDate)
    : toShortDate(detail.startDate) + '-' + toShortDate(detail.endDate)

    const detailProp = this.getDetailProp(detail.prop)

    return (
      <main className="ui two column stackable centered full page grid">
        <div className="column">
          <div className="row">
            <div className="ui fluid detail card">
              <div className={detailClass}>
                <div className="meta">
                  <span className="ui orange label large right floated time">
                    {eventDate}
                  </span>
                </div>
                <div className="header">{detail.title}</div>
                <span className="ui tag label category">{detailProp}</span>
                <div className="ui divider"></div>
                <div className="description">
                  {finalContent}
                  { files && !isEmpty(files)
                    && <div className="ui divider"></div> }
                  {
                    files && !isEmpty(files)
                    && files.map(function (file, i) {
                      return (
                        <div
                          className="fileName"
                          key={i}
                          data-filetype={getFileExt(file)}>
                          <a
                            target="_blank"
                            href={'/uploads/' + file}>
                            { file }
                          </a>
                        </div>
                      )
                    })
                  }
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
          <div className="ui hidden divider"></div>
          {this.props.auth.user.id === detail.uid &&
          <div className="row">
            <div className="ui orange icon buttons right floated">
              <button className="ui button">
                <i className="edit icon"></i> 編輯內容
              </button>
              <button className="ui button">
                <i className="map icon"></i> 修改地圖
              </button>
              <button className="ui button">
                <i className="delete icon"></i> 刪除佈告
              </button>
            </div>
          </div>
          }
        </div>
        <div className="column">
          { (detail.lat && detail.lat) &&
          <GMap
            ref="gmap"
            {...this.props.map}
          />
          }
          { (!detail.lat || !detail.lat) &&
          <div className="ui orange center aligned segment">
            <Translate content="post.detail.nomap" />
          </div>
          }
          <div className="row">
            <MediaQuery maxDeviceWidth={768}>
              <div className="ui basic segment center aligned">
                <Ad
                  id="1S"
                  link="http://mx1.hotrank.com.tw/script/oursweb/200x200"
                />
              </div>
            </MediaQuery>
            <MediaQuery maxWidth={768}>
              <div className="ui basic segment center aligned">
                <Ad
                  id="1S"
                  link="http://mx1.hotrank.com.tw/script/oursweb/200x200"
                />
              </div>
            </MediaQuery>
            <MediaQuery minWidth={769} minDeviceWidth={769}>
              <div className="ui basic segment center aligned">
                <Ad
                  id="1L"
                  link="http://mx1.hotrank.com.tw/script/oursweb/All_468x40"
                />
              </div>
            </MediaQuery>
          </div>
        </div>
      </main>
    )
  }
}
