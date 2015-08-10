import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import { toShortDate } from 'shared/utils/date-utils'
import { getFileExt } from 'shared/utils/file-utils'

export default class PostCard extends BaseComponent {

  static propTypes = {
    data: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  /* eslint-disable max-len */
  render () {
    const card = this.props.data
    const files = JSON.parse(card.file)
    return (
      <div className="ui fluid orange card">
        <div className="content">
          <div className="header">
            <Link to={`/wall/posts/${card.id}`}>{card.title}</Link>
          </div>
          <div className="meta">
            <span className="right floated time">
              {toShortDate(card.startDate)}
                ~
              {toShortDate(card.endDate)}
            </span>
            <span className="category">{card.prop}</span>
          </div>
          <div className="description">
          { files && !isEmpty(files) && <div className="ui divider"></div> }
          {
            files && !isEmpty(files) && files.map(function (file, i) {
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
          <span className="left floated">
            <i className="user icon"></i>
            75 Views
          </span>
          <span className="right floated like">
            <i className="like icon"></i>
            { card.place ? (
                <a target="_blank" href={`http://maps.google.com/maps?z=18&q=${card.lat},${card.lng}`}>{card.place}</a>
              )
              : `Chinese Christian Network Development Association` }
          </span>
        </div>
      </div>
    )
  }
}
