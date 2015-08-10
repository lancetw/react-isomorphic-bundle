import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { isEmpty, throttle } from 'lodash'
import Card from 'shared/components/wall/PostCard'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import $ from 'jquery'
import Infinite from 'react-infinite'

export default class PostCards extends BaseComponent {

  constructor (props) {
    super(props)
    this.state = { shouldLoadFunc: false }
  }

  static propTypes = {
    posts: PropTypes.array.isRequired,
    loadFunc: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    containerHeightDiff: PropTypes.number
  }

  handleInfiniteLoad (event) {
    this.props.loadFunc()
    this.setState({ shouldLoadFunc: true })
  }

  elementInfiniteLoad () {
    const Translate = require('react-translate-component')
    return (
      <div className="ui segment basic has-header">
        <div className="ui active inverted dimmer">
          <div className="ui large text loader">
            <Translate content="wall.loading" />
          </div>
        </div>
      </div>
    )
  }

  render () {
    const cards = this.props.posts
    const containerHeight =
      $(document).height()
      - this.props.containerHeightDiff

    if (process.env.BROWSER && this.props.posts.length > 0)
      return (
        <Infinite
          className="scroll-content"
          infiniteLoadBeginBottomOffset={$(document).height() * 0.6}
          containerHeight={containerHeight}
          onInfiniteLoad={::this.handleInfiniteLoad}
          isInfiniteLoading={this.props.posts.hasMore}
          loadingSpinnerDelegate={this.elementInfiniteLoad()}
          elementHeight={130}>
          {!isEmpty(cards) && cards.map(function (card) {
            return <Card key={card.id} data={card} />
          })}
        </Infinite>
      )
    else return (
      <div className="ui cards" ref="scrollable">
        {!isEmpty(cards) && cards.map(function (card) {
          return <Card key={card.id} data={card} />
        })}
      </div>
    )
  }
}
