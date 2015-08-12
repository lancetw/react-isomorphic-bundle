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
    this.state = {
      isInfiniteLoading: false,
      windowWidth: typeof window !== 'undefined' && window.innerWidth,
      windowHeight: typeof window !== 'undefined' && window.innerHeight
    }
  }

  static propTypes = {
    posts: PropTypes.array.isRequired,
    loadFunc: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    diff: PropTypes.number.isRequired
  }

  static defaultProps = {
    diff: 0
  }

  handleResize (event) {
    this.setState({
      windowWidth: window.innerWidth, windowHeight: window.innerHeight
    })
  }

  handleInfiniteLoad (event) {
    this.setState({ isInfiniteLoading: true })
    setTimeout(() => {
      this.props.loadFunc()
      this.setState({ isInfiniteLoading: false })
    }, 2500)
  }

  elementInfiniteLoad () {
    if (this.props.hasMore) {
      const Translate = require('react-translate-component')
      return (
        <div className="ui segment basic has-header">
          <div className="ui active inverted dimmer">
            <div className="ui small indeterminate text loader">
              <Translate content="wall.loading" />
            </div>
          </div>
        </div>
      )
    }
  }

  componentDidMount () {
    window.addEventListener('resize', ::this.handleResize)
    React.initializeTouchEvents(true)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    const cards = this.props.posts

    if (process.env.BROWSER && this.props.posts.length > 0) {
      const containerHeight = this.state.windowHeight - this.props.diff
      return (
        <Infinite
          className="scroll-content"
          infiniteLoadBeginBottomOffset={200}
          containerHeight={containerHeight}
          onInfiniteLoad={::this.handleInfiniteLoad}
          isInfiniteLoading={this.state.isInfiniteLoading}
          loadingSpinnerDelegate={this.elementInfiniteLoad()}
          elementHeight={132}
          timeScrollStateLastsForAfterUserScrolls={150}>
          {!isEmpty(cards) && cards.map(function (card) {
            return <Card key={card.id} data={card} />
          })}
        </Infinite>
      )
    } else return (
      <div className="ui cards" ref="scrollable">
        {!isEmpty(cards) && cards.map(function (card) {
          return <Card key={card.id} data={card} />
        })}
      </div>
    )
  }
}
