import React from 'react'
import counterpart from 'counterpart'

export default class BaseComponent extends React.Component {

  _bind (...methods) {
    methods.forEach(
      (method) => this[method] = this[method].bind(this)
    )
  }

  isMounted () {
    try {
      React.findDOMNode(this)
      return true
    } catch (e) {
      return false
    }
  }

  _T (key) {
    if (typeof this.context.translator !== 'undefined') {
      return this.context.translator.translate(key)
    } else {
      return counterpart(key)
    }
  }

  getLocale () {
    if (typeof this.context.translator !== 'undefined') {
      return this.context.translator.getLocale()
    } else {
      return counterpart.getLocale()
    }
  }

}
