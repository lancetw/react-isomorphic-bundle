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

    this.loaded = false
  }

  componentDidMount () {
    this.loadAd()
    this.loaded = true
  }

  loadAd = () => {
    if (!this.loaded) {
      require('postscribe/htmlParser/htmlParser.js')
      const postscribe = require('exports?postscribe!postscribe')
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            postscribe('#hotrank-container-' + this.props.size,
              `<script src='${this.props.link}'></script>`,
              { done: () => { resolve(true) } })
          } catch (err) { reject(err) }
        }, 0)
      })
    }
  }

  render () {
    if (process.env.BROWSER) {
      return (
        <div className="ad"
          ref={`hotrank-container-${this.props.size}`}
          id={`hotrank-container-${this.props.size}`}>
        </div>
      )
    } else {
      return (<div />)
    }
  }
}
