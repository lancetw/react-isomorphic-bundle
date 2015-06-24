import React, { PropTypes } from 'react'
import BaseComponent from 'shared/components/BaseComponent'
import { isEmpty } from 'lodash'
import Card from 'shared/components/wall/PostCard'

export default class PostCards extends BaseComponent {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    posts: PropTypes.array.isRequired
  }

  render () {
    const cards = this.props.posts
    return (
      <div className="ui cards">
        {!isEmpty(cards) && cards.map(function (card) {
          return <Card key={card.id} data={card} />
        })}
        {isEmpty(cards) && (
          <div className="ui fluid card">
            <div className="content">
              No data.
            </div>
          </div>
        )}
      </div>
    )
  }
}
