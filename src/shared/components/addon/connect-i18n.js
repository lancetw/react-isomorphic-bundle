import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import counterpart from 'counterpart'
import { fixLocaleName } from 'shared/utils/locale-utils'
import moment from 'moment'
import 'moment/locale/zh-tw'
import 'moment/locale/zh-cn'

// Great thanks to kikoanis (Ali Hmer), https://github.com/kikoanis
export default function connectI18n(handler) {
  return function(ComposedComponent) {
    return class Wrapper extends Component {

      static contextTypes = {
        translator: PropTypes.object
      }

      constructor (props, context) {
        super(props)

        if (typeof context !== 'undefined'
          && typeof context.translator !== 'undefined') {
          this.state = { defaultLocale: context.translator.getLocale() }
        } else {
          this.state = { defaultLocale: counterpart.getLocale() }
        }
      }

      componentWillMount () {
        moment.locale(fixLocaleName(this.state.defaultLocale))
      }

      componentDidMount () {
        counterpart.onLocaleChange(this.handleLocaleChange)
      }

      componentWillUnmount () {
        counterpart.offLocaleChange(this.handleLocaleChange)
      }

      translate = (key) => {
        if (typeof this.context !== 'undefined'
          && typeof this.context.translator !== 'undefined') {
          return this.context.translator.translate(key)
        } else {
          return counterpart(key)
        }
      }

      handleLocaleChange = (newLocale) => {
        moment.locale(fixLocaleName(newLocale))
        this.setState({ defaultLocale: newLocale })
        if (handler) {
          this.setState(handler(newLocale))
        }
      }

      render() {
        return (<ComposedComponent
          _T={this.translate}
          {...this.props}
          {...this.state} />)
      }
    }
  }
}
