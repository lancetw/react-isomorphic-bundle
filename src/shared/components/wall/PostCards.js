import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { isEmpty, throttle } from 'lodash'
import Card from 'shared/components/wall/PostCard'
import $ from 'jquery'

export default class PostCards extends BaseComponent {

  constructor (props) {
    super(props)
    this.state = { shouldLoadFunc: false }
  }

  static propTypes = {
    posts: PropTypes.array.isRequired,
    loadFunc: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired
  }

  getDocHeight () {
    const D = document
    return Math.max(
      Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
      Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
      Math.max(D.body.clientHeight, D.documentElement.clientHeight)
    )
  }

  getOffsetHeight () {
    const D = document
    return Math.max(D.body.offsetHeight, D.documentElement.offsetHeight)
  }

  isScrollToLoad (threshold=1) {
    let elemHeight = this.getDocHeight() - this.getOffsetHeight()
    return $(document).scrollTop() >= parseInt(elemHeight * threshold, 10)
  }

  handleScroll (event) {
    const threshold = 0.7
    if (this.isScrollToLoad(threshold))
      this.setState({ shouldLoadFunc: true })
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextState.shouldLoadFunc && this.props.hasMore) {
      this.setState({ shouldLoadFunc: false })
      this.props.loadFunc()
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', throttle(::this.handleScroll, 300))
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render () {
    const cards = this.props.posts
    return (
      <div className="ui cards" ref="scrollable">
        {!isEmpty(cards) && cards.map(function (card) {
          return <Card key={card.id} data={card} />
        })}
      </div>
    )
  }
}
