import React, { PropTypes } from 'react'
import { BaseComponent } from 'shared/components'
import { isEmpty } from 'lodash'
import Card from 'shared/components/wall/PostCard'

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

  isScrollToLoad (elem, threshold=1) {
    const elemHeight = elem.scrollHeight - elem.clientHeight
    return elem.scrollTop >= parseInt(elemHeight * threshold, 10)
  }

  handleScroll (event) {
    const elem = event.srcElement.body
    const threshold = 0.8
    if (this.isScrollToLoad(elem, threshold))
      this.setState({ shouldLoadFunc: true })
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextState.shouldLoadFunc && this.props.hasMore) {
      this.setState({ shouldLoadFunc: false })
      this.props.loadFunc()
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', ::this.handleScroll)
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
