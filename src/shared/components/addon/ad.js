/* eslint-disable max-len */
import React, { PropTypes } from 'react'

export default class Ad extends React.Component {

  constructor (props) {
    super(props)
    this.releaseTimeout = undefined
    this.state = { released: false }
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  }

  loadAd () {
    if (process.env.BROWSER) {

      require('postscribe/htmlParser/htmlParser.js')
      const postscribe = require('exports?postscribe!postscribe')

      new Promise((resolve) => {
        setTimeout(() => {
          postscribe('#hotrank-container-' + this.props.id, `<script src='${this.props.link}'></script>`,
          { done: () => { resolve(true) } })
        }, 0)
      }).then(() => this.setState({ released: true }))
    }
  }

  componentDidMount () {
    this.releaseTimeout = setTimeout(() => this.loadAd(), 500)
  }

  componentWillUnmount () {
    if (this.op)
      clearTimeout(this.releaseTimeout)
  }

  render () {
    return (
      <div id={`hotrank-container-${this.props.id}`}></div>
    )
  }
}
