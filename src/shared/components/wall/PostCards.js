import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { isEmpty, debounce } from 'lodash'
import Card from 'shared/components/wall/PostCard'
import classNames from 'classnames'
import shouldPureComponentUpdate from 'react-pure-render/function'
import { detectIE } from 'shared/utils/browser-utils'

let $
let ReactList

if (process.env.BROWSER) {
  ReactList = require('react-list')
  $ = require('jquery')
  require('css/ui/spinkit')

  // requestAnimationFrame: http://www.inazumatv.com/contents/archives/9226
  let lastTime = 0
  const vendors = ['ms', 'moz', 'webkit', 'o']
  for (let x = 0, limit = vendors.length; x < limit && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame']
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      const currTime = new Date().getTime()
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = window.setTimeout(function () { callback( currTime + timeToCall ); }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
}

export default class PostCards extends Component {

  static propTypes = {
    posts: PropTypes.array.isRequired,
    loadFunc: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
    diff: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    threshold: PropTypes.number
  }

  static defaultProps = {
    diff: 0,
    isFetching: false,
    threshold: 540
  }

  constructor (props) {
    super(props)
    this.state = {
      triggered: false,
      windowWidth: typeof window !== 'undefined' && window.innerWidth,
      windowHeight: typeof window !== 'undefined' && window.innerHeight
    }

    this.scrollTimeout = null
    this.lastPosition = -1
    this.rafId = null
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.fastScrollLoop()
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.isFetching) {
      this.scrollTimeout = setTimeout(() => {
        this.setState({ triggered: false })
        $('#overlay').remove()
        $('body').unbind('touchmove')
      }, 0)
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
    if (this.op) {
      clearTimeout(this.scrollTimeout)
    }
    this.lastPosition = -1
    window.cancelAnimationFrame(this.rafId)
  }

  handleResize = () => {
    this.setState({
      windowWidth: window.innerWidth, windowHeight: window.innerHeight
    })
  }

  handleScroll = (event) => {
    if (!!this.props.hasMore) {
      const nodeScroll = ReactDOM.findDOMNode(this.refs.scroll)
      this.handleInfiniteLoad(nodeScroll.scrollTop)
    }
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
        this.rafId = window.requestAnimationFrame(this.fastScrollLoop)
        return false
      } else {
        this.lastPosition = scrollTop
      }

      if (!!this.props.hasMore) {
        this.handleInfiniteLoad(scrollTop)
      }
    }

    this.rafId = window.requestAnimationFrame(this.fastScrollLoop)
  }

  renderItem = (index, key) => {
    const card = this.props.posts[index]
    return (
      <Card
        key={key}
        data={card}
      />
    )
  }

  renderScrollList = (type, useTranslate3d) => {
    return (
      <ReactList
        ref="scrollList"
        threshold={100}
        pageSize={20}
        initialIndex={0}
        itemRenderer={this.renderItem}
        length={this.props.posts.length}
        type={type}
        useTranslate3d={useTranslate3d} />
    )
  }

  render () {
    const cards = this.props.posts

    const scrollClass = classNames(
      'ui',
      'scrollable'
    )

    if (process.env.BROWSER && cards.length > 0) {
      const containerHeight = this.state.windowHeight - this.props.diff
      const isIE = detectIE()
      if (!isIE || isIE > 11) {
        const useTranslate3d = true
        return (
          <div
            className={scrollClass}
            ref="scroll"
            style={{
              maxHeight: containerHeight
            }}>
            {this.renderScrollList('uniform', useTranslate3d)}
          </div>
        )
      } else {
        const useTranslate3d = false
        return (
          <div
            className={scrollClass}
            ref="scroll"
            style={{
              maxHeight: containerHeight
            }}>
            {this.renderScrollList('variable', useTranslate3d)}
          </div>
        )
      }
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
}
