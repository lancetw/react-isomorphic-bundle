import React, { Component, PropTypes } from 'react'
import counterpart from 'counterpart'
import * as LocaleActions from 'shared/actions/LocaleActions'
import { connect } from 'react-redux'
import { trans2Simp, trans2Trad, toSimpChinese, toTradChinese } from 'shared/utils/tongwen'

class LocaleSwitcher extends Component {

  static propTypes = {
    locale: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
  }

  handleChange = (evt) => {
    const lang = evt.target.getAttribute('value')
    counterpart.setLocale(lang)

    let title = counterpart(this.props.locale.title)
    if (title.startsWith('missing')) {
      title = this.props.locale.title
    }
    const defaultTitle = counterpart('title.site')
    if (defaultTitle) {
      document.title = `${title} | ${defaultTitle}`
    } else {
      document.title = `${title}`
    }

    if (lang.endsWith('cn')) {
      trans2Simp(document)
    } else if (lang.endsWith('tw')) {
      trans2Trad(document)
    } else {
      trans2Trad(document)
    }
  }

  render () {
    return (
      <div className="ui simple dropdown item">
        <i className="world icon"></i>
        <i className="dropdown icon"></i>
        <div className="menu">
          <div
            onClick={this.handleChange}
            className="item"
            value="zh-hant-tw">
            正體中文
          </div>
          <div
            onClick={this.handleChange}
            className="item"
            value="zh-hant-cn">
            简体中文
          </div>
          <div
            onClick={this.handleChange}
            className="item"
            value="en">
            English
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  locale: state.locale
}))(LocaleSwitcher)
