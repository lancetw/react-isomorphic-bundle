import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import moment from 'moment'
import { isEmpty } from 'lodash'

export default class PostCard extends BaseComponent{

  static propTypes = {
    data: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const card = this.props.data
    const files = JSON.parse(card.file)
    return (
      <div className="ui fluid orange card">
        <div className="content">
          <div className="header">{card.title}</div>
          <div className="meta">
            <span className="right floated time">
              {moment(card.startDate.split(' ')[0]).format('M/D')}
                ~
              {moment(card.endDate.split(' ')[0]).format('M/D')}
            </span>
            <span className="category">{card.prop}</span>
          </div>
          <div className="description">
          { files && !isEmpty(files) && <div className="ui divider"></div> }
          {
            files && !isEmpty(files) && files.map(function (file, i) {
              return (
                <div key={i}>
                  <a target="_blank" href={'/uploads/' + file}>
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
            Chinese Christian Network Development Association
          </span>
        </div>
      </div>
    )
  }
}
