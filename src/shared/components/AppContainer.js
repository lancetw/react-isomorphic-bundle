import React, { PropTypes } from 'react'

const Translate = require('react-translate-component')

export default class AppContainer extends React.Component {

  static propTypes = {
    children: PropTypes.any,
    translator: Translate.translatorType
  }

  static childContextTypes = {
    translator: Translate.translatorType
  }

  constructor (props) {
    super(props)
  }

  getChildContext () {
    return {
      translator: this.props.translator
    }
  }

  render () {
    const { children } = this.props
    return children()
  }
}

