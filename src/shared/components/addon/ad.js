/* eslint-disable max-len */
// ref: https://gist.github.com/Ambroos/734933c4d3d11c3af847
import React, { Component, PropTypes } from 'react'

export default class Ad extends Component {

  static propTypes = {
    size: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.releaseTimeout = undefined
    this.state = { released: false }
  }

  componentDidMount () {
    this.releaseTimeout = setTimeout(() => this.loadAd(), 500)
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
    }
  }

  loadAd () {
    if (process.env.BROWSER) {
      require('postscribe/htmlParser/htmlParser.js')
      const postscribe = require('exports?postscribe!postscribe')

      new Promise((resolve) => {
        setTimeout(() => {
          postscribe('#hotrank-container-' + this.props.size,
            `<script src='${this.props.link}'></script>`,
            { done: () => { resolve(true) } })
        }, 0)
      }).then(() => this.setState({ released: true }))
    }
  }

  render () {
    return (
      <div className="ad"
        ref={`hotrank-container-${this.props.size}`}
        id={`hotrank-container-${this.props.size}`}>
      </div>
    )
  }
}
