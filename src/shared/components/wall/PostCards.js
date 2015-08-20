import React, { PropTypes, Component } from 'react'
import { BaseComponent } from 'shared/components'
import { isEmpty, debounce } from 'lodash'
import Card from 'shared/components/wall/PostCard'
import ReactList from 'react-list'
import classNames from 'classnames'

let $
if (process.env.BROWSER) {
  $ = require('jquery')
}

export default class PostCards extends Component {

  static propTypes = {
    posts: PropTypes.array.isRequired,
    loadFunc: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    diff: PropTypes.number.isRequired,
    defaultLocale: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired
  }

  static defaultProps = {
    diff: 0,
    defaultLocale: 'en',
    isFetching: false
  }

  constructor (props) {
    super(props)
    this.state = {
      disablePointer: false,
      firstLoad: true,
      isInfiniteLoading: false,
      windowWidth: typeof window !== 'undefined' && window.innerWidth,
      windowHeight: typeof window !== 'undefined' && window.innerHeight
    }

    const disablePointerTimeout = null
  }

  componentDidMount () {
    window.addEventListener('resize', ::this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  renderItem (index, key) {
    const card = this.props.posts[index]
    return (
      <Card
        key={key}
        data={card}
        defaultLocale={this.props.defaultLocale}
      />
    )
  }

  render () {
    const cards = this.props.posts

    const scrollClass
      = classNames(
        'ui',
        'scrollable',
        {'disable-pointer': this.state.disablePointer}
      )

    if (process.env.BROWSER && cards.length > 0) {
      const containerHeight = this.state.windowHeight - this.props.diff
      return (
        <div
          className={scrollClass}
          ref="scroll"
          onScroll={debounce(::this.handleScroll, 100)}
          style={{
            maxHeight: containerHeight
          }}>
          <ReactList
            ref="scrollList"
            threshold={150}
            pageSize={25}
            initialIndex={0}
            itemRenderer={::this.renderItem}
            length={cards.length}
            type="uniform" />
        </div>
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

  handleScroll (event) {
    this.setState({ disablePointer: true })
    if (this.props.hasMore) {
      this.handleInfiniteLoad()
    }
    if (this.disablePointerTimeout !== null) {
      clearTimeout(this.disablePointerTimeout)
    }
    this.disablePointerTimeout = setTimeout(() => {
      this.setState({ disablePointer: false })
    }, 50)
  }

  handleResize () {
    this.setState({
      windowWidth: window.innerWidth, windowHeight: window.innerHeight
    })
  }

  handleInfiniteLoad () {
    const nodeScroll = React.findDOMNode(this.refs.scroll)
    const nodeList = React.findDOMNode(this.refs.scrollList)
    const loading = this.props.isFetching
    const threshold = 1000

    if (this.state.firstLoad) {
      this.setState({ firstLoad: false })
    }

    if (!loading && !this.state.isInfiniteLoading) {
      setTimeout(() => {
        if ($(nodeScroll).scrollTop() > $(nodeList).innerHeight() - threshold) {
          this.setState({ isInfiniteLoading: true })
          console.log('loading')
          this.props.loadFunc()
          setTimeout(() => {
            this.setState({ isInfiniteLoading: false })
          }, 3000)
        }
      }, 1000)
    }
  }

  elementInfiniteLoad () {
    if (this.props.hasMore) {
      const Translate = require('react-translate-component')
      return (
        <div className="ui segment basic has-header">
          <div className="ui active inverted dimmer">
            <div className="ui indeterminate text loader">
              <Translate content="wall.loading" />
            </div>
          </div>
        </div>
      )
    }
  }
}
