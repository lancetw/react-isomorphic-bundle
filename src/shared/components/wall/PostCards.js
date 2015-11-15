import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { isEmpty } from 'lodash'
import Card from 'shared/components/wall/PostCard'
import classNames from 'classnames'
import shouldPureComponentUpdate from 'react-pure-render/function'

let $
let ReactList
let requestAnimationFrame
if (process.env.BROWSER) {
  ReactList = require('react-list')
  $ = require('jquery')
  require('css/ui/spinkit')

  requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000/60) }
}

export default class PostCards extends Component {

  static propTypes = {
    posts: PropTypes.array.isRequired,
    loadFunc: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    diff: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    threshold: PropTypes.number,
    defaultLocale: PropTypes.string.isRequired
  }

  static defaultProps = {
    diff: 0,
    isFetching: false,
    threshold: 540
  }

  constructor (props) {
    super(props)
    this.state = {
      disablePointer: false,
      triggered: false,
      windowWidth: typeof window !== 'undefined' && window.innerWidth,
      windowHeight: typeof window !== 'undefined' && window.innerHeight
    }

    this.disablePointerTimeout = null
    this.scrollTimeout = null
    this.lastPosition = -1
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.fastScrollLoop()
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.isFetching) {
      this.scrollTimeout = setTimeout(() => {
        this.setState({ disablePointer: false })
        this.setState({ triggered: false })
        $('#overlay').remove()
        $('body').unbind('touchmove')
      }, 0)
    } else {
      this.setState({ disablePointer: true })
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
    if (this.op) {
      clearTimeout(this.scrollTimeout)
    }
    this.lastPosition = -1
  }

  handleResize = () => {
    this.setState({
      windowWidth: window.innerWidth, windowHeight: window.innerHeight
    })
  }

  handleInfiniteLoad = (scrollTop) => {
    const nodeScroll = ReactDOM.findDOMNode(this.refs.scroll)
    const nodeList = ReactDOM.findDOMNode(this.refs.scrollList)
    const contentHeight = $(nodeList).height() - $(nodeScroll).height()
    const loading = this.props.isFetching
    const checkPoint = (contentHeight - this.props.threshold) > 0
      ? contentHeight - this.props.threshold
      : contentHeight

    /* eslint-disable max-len */
    if (!this.state.triggered && scrollTop > checkPoint) {
      $('body').bind('touchmove', function(e) { e.preventDefault() })
      $('<div id="overlay"><div id="loading"><div class="scroll-spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div></div>').appendTo('.ui.scrollable')
      this.setState({ triggered: true })

      this.props.loadFunc()
    }
  }

  fastScrollLoop = () => {
    const nodeScroll = ReactDOM.findDOMNode(this.refs.scroll)

    if (nodeScroll) {
      const scrollTop = nodeScroll.scrollTop

      if (this.lastPosition === scrollTop) {
        requestAnimationFrame(this.fastScrollLoop)
        return false
      } else {
        this.lastPosition = scrollTop
      }

      if (!!this.props.hasMore) {
        this.setState({ disablePointer: true })
        this.handleInfiniteLoad(scrollTop)
      }
    }

    requestAnimationFrame(this.fastScrollLoop)
  }

  renderItem = (index, key) => {
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
        {'disable-pointer': this.disablePointer}
      )

    if (process.env.BROWSER && cards.length > 0) {
      const containerHeight = this.state.windowHeight - this.props.diff
      const useTranslate3d = true
      return (
        <div
          className={scrollClass}
          ref="scroll"
          style={{
            maxHeight: containerHeight
          }}>
          <ReactList
            ref="scrollList"
            threshold={100}
            pageSize={20}
            initialIndex={0}
            itemRenderer={this.renderItem}
            length={cards.length}
            type="uniform"
            useTranslate3d={useTranslate3d}
            />
          {this.elementInfiniteLoad}
        </div>
      )
    } else {
      const { defaultLocale } = this.props
      return (
        <div className="ui cards" ref="scrollable">
          {!isEmpty(cards) && cards.map(function (card) {
            return <Card key={card.id} data={card} defaultLocale={defaultLocale} />
          })}
        </div>
      )
    }
  }
}
