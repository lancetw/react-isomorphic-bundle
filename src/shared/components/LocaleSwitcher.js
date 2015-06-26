import React, { PropTypes } from 'react'
import counterpart from 'counterpart'
import DocumentTitle from 'shared/components/addon/document-title'

export default class LocaleSwitcher extends React.Component {

  constructor (props) {
    super(props)

    counterpart.onLocaleChange(::this.handleLocaleChange)
  }

  static contextTypes = {
    translator: PropTypes.object.isRequired
  }

  handleChange (e) {
    counterpart.setLocale(e.target.value)
  }

  handleLocaleChange () {
    //document.title = DocumentTitle.rewind()
  }

  render () {
    return (
      <div className="item ui mini locale-switcher">
        <select ref="test"
          defaultValue={counterpart.getLocale()}
          onChange={this.handleChange}>
          <option value="zh-hant-tw">正體中文</option>
          <option value="en">English</option>
        </select>
      </div>
    )
  }
}

