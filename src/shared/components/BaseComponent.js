import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import counterpart from 'counterpart'

export default class BaseComponent extends React.Component {

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

  _bind (...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    )
  }

  isMounted () {
    try {
      ReactDOM.findDOMNode(this)
      return true
    } catch (e) {
      return false
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
