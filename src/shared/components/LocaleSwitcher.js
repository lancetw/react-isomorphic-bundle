import React, { PropTypes } from 'react'
import counterpart from 'counterpart'
import * as LocaleActions from 'shared/actions/LocaleActions'
import { connect } from 'react-redux'
import { toSimpChinese, toTradChinese } from 'shared/utils/tongwen'

class LocaleSwitcher extends React.Component {

  static propTypes = {
    locale: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.handleChange = ::this.handleChange
  }

  handleChange (e) {
    const lang = e.target.getAttribute('value')
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
      TongWen.trans2Simp(document) && _jf.flush()
    } else if (lang.endsWith('tw')) {
      TongWen.trans2Trad(document) && _jf.flush()
    } else {
      TongWen.trans2Trad(document) && _jf.flush()
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
