import React, { PropTypes, Component } from 'react'
import { BaseComponent } from 'shared/components'
import { isEmpty, debounce } from 'lodash'
import Card from 'shared/components/wall/PostCard'
import classNames from 'classnames'
import shouldPureComponentUpdate from 'react-pure-render/function'

let $
let ReactList
if (process.env.BROWSER) {
  ReactList = require('react-list')
  $ = require('jquery')
  require('css/ui/spinkit')
}

export default class PostCards extends BaseComponent {

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
    threshold: 400
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
  }

  componentDidMount () {
    window.addEventListener('resize', ::this.handleResize)
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.isFetching) {
      this.scrollTimeout = setTimeout(() => {
        this.setState({disablePointer: false })
        this.setState({ triggered: false })
        $('#overlay').remove()
        $('body').unbind('touchmove')
      }, 0)
    } else {
      this.setState({disablePointer: true })
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
    if (this.op) {
      clearTimeout(this.scrollTimeout)
    }
  }

  handleScroll (event) {
    if (!!this.props.hasMore) {
      this.setState({disablePointer: true })
      this.handleInfiniteLoad(this.props.threshold)
    }
  }

  handleResize () {
    this.setState({
      windowWidth: window.innerWidth, windowHeight: window.innerHeight
    })
  }

  handleInfiniteLoad (threshold) {
    const nodeScroll = React.findDOMNode(this.refs.scroll)
    const nodeList = React.findDOMNode(this.refs.scrollList)
    const contentHeight = $(nodeList).height() - $(nodeScroll).height()
    const scrollTop = nodeScroll.scrollTop
    const loading = this.props.isFetching
    const checkPoint = (contentHeight - threshold) > 0
      ? contentHeight - threshold
      : contentHeight

    /* eslint-disable max-len */
    if (!this.state.triggered && nodeScroll.scrollTop > checkPoint) {
      $('body').bind('touchmove', function(e) { e.preventDefault() })
      $('<div id="overlay"><div id="loading"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div></div>').appendTo('.ui.scrollable')
      this.setState({ triggered: true })

      this.props.loadFunc()
    }
  }

  renderItem (index, key) {
    const card = this.props.posts[index]
    return (
      <Card
        key={key}
        data={card}
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
      return (
        <div
          className={scrollClass}
          ref="scroll"
          onScroll={debounce(::this.handleScroll, 500)}
          style={{
            maxHeight: containerHeight
          }}>
          <ReactList
            ref="scrollList"
            threshold={150}
            pageSize={10}
            initialIndex={0}
            itemRenderer={::this.renderItem}
            length={cards.length}
            type="variable" />
          {this.elementInfiniteLoad}
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
}
