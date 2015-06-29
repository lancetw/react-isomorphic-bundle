import React, { PropTypes } from 'react'
import counterpart from 'counterpart'
import DocumentTitle from 'shared/components/addon/document-title'
import * as LocaleActions from 'shared/actions/LocaleActions'
import Dropdown from 'shared/components/portals/dropdown'

export default class LocaleSwitcher extends React.Component {

  constructor (props) {
    super(props)

    this.handleChange = ::this.handleChange
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  handleChange (e) {
    const lang = e.target.getAttribute('value')
    counterpart.setLocale(lang)
    this.props.dispatch(
      LocaleActions.sync(lang)
    )
  }

  render () {
    return (
      <Dropdown className="item">
        <div
          onClick={this.handleChange}
          className="item"
          value="zh-hant-tw">
          正體中文
        </div>
        <div
          onClick={this.handleChange}
          className="item"
          value="en">
          English
        </div>
      </Dropdown>
    )
  }
}
