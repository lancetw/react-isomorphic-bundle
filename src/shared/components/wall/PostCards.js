import React, { PropTypes, Component } from 'react'
import { BaseComponent } from 'shared/components'
import { isEmpty, debounce } from 'lodash'
import Card from 'shared/components/wall/PostCard'
import Infinite from 'react-infinite'

export default class PostCards extends Component {

  static propTypes = {
    posts: PropTypes.array.isRequired,
    loadFunc: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    diff: PropTypes.number.isRequired,
    defaultLocale: PropTypes.string.isRequired
  }

  static defaultProps = {
    diff: 0,
    defaultLocale: 'en'
  }

  constructor (props) {
    super(props)
    this.state = {
      isInfiniteLoading: false,
      windowWidth: typeof window !== 'undefined' && window.innerWidth,
      windowHeight: typeof window !== 'undefined' && window.innerHeight
    }
  }

  componentDidMount () {
    window.addEventListener('resize', ::this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  render () {
    const cards = this.props.posts
    const defaultLocale = this.props.defaultLocale

    if (process.env.BROWSER && this.props.posts.length > 0) {
      const containerHeight = this.state.windowHeight - this.props.diff
      return (
        <Infinite
          className="scroll-content"
          infiniteLoadBeginBottomOffset={200}
          containerHeight={containerHeight}
          onInfiniteLoad={debounce(::this.handleInfiniteLoad, 3000)}
          isInfiniteLoading={this.state.isInfiniteLoading}
          loadingSpinnerDelegate={this.elementInfiniteLoad()}
          elementHeight={148}
          timeScrollStateLastsForAfterUserScrolls={150}>
          {!isEmpty(cards) && cards.map(function (card) {
            return (
              <Card
                key={card.id}
                data={card}
                defaultLocale={defaultLocale}
              />)
          })}
        </Infinite>
      )
    } else {
      return (
        <div className="ui cards" ref="scrollable">
          {!isEmpty(cards) && cards.map(function (card) {
            return <Card key={card.id} data={card} />
          })}
        </div>
      )
    }
  }

  handleResize () {
    this.setState({
      windowWidth: window.innerWidth, windowHeight: window.innerHeight
    })
  }

  handleInfiniteLoad () {
    this.props.loadFunc()
    this.setState({ isInfiniteLoading: false })
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

}
