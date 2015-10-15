import React, { PropTypes } from 'react'

const Translate = require('react-translate-component')

export default class AppContainer extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    children: PropTypes.any,
    translator: Translate.translatorType,
    host: PropTypes.string
  }

  static childContextTypes = {
    translator: Translate.translatorType,
    host: PropTypes.string
  }

  getChildContext () {
    return {
      translator: this.props.translator,
      host: this.props.host
    }
  }

  render () {
    const { children } = this.props
    return children()
  }
}

