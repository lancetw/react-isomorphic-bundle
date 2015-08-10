import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import counterpart from 'counterpart'
import GMap from 'shared/components/addon/maps/gmap'
import { isEmpty } from 'lodash'
import { toShortDate } from 'shared/utils/date-utils'
import { getFileExt } from 'shared/utils/file-utils'
import classNames from 'classnames'
import Ad from 'shared/components/addon/ad'

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
    const { detail } = this.props.post
    const files = typeof detail.file !== 'undefined'
      ? JSON.parse(detail.file)
      : []

    const detailClass = detail.id
      ? classNames('content')
      : classNames('content', 'hide')

    return (
      <main className="ui two column stackable centered page grid">
        <div className="column">
          <div className="ui fluid card">
            <div className={detailClass}>
              <i className="right floated like icon"></i>
              <i className="right floated star icon"></i>
              <div className="header">{detail.title}</div>
              <div className="meta">
                <span className="right floated time">
                  {toShortDate(detail.startDate)}
                    ~
                  {toShortDate(detail.endDate)}
                </span>
                <span className="category">{detail.prop}</span>
              </div>
              <div className="description">
                <p>{detail.content}</p>
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
        <div className="column">
          <Ad
            id="1L"
            link="http://mx1.hotrank.com.tw/script/oursweb/All_468x40"
          />
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
        </div>
      </main>
    )
  }
}
