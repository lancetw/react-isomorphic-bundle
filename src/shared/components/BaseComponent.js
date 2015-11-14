import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import counterpart from 'counterpart'

export default class BaseComponent extends Component {

  static contextTypes = {
    translator: PropTypes.object
  }

  constructor (props) {
    super(props)
  }

  getLocale () {
    if (typeof this.context !== 'undefined'
      && typeof this.context.translator !== 'undefined') {
      return this.context.translator.getLocale()
    } else {
      return counterpart.getLocale()
    }
  }

  _T (key) {
    if (typeof this.context !== 'undefined'
      && typeof this.context.translator !== 'undefined') {
      return this.context.translator.translate(key)
    } else {
      return counterpart(key)
    }
  }
}
