import React, { PropTypes } from 'react'
import counterpart from 'counterpart'
import DocumentTitle from 'shared/components/addon/document-title'
import * as LocaleActions from 'shared/actions/LocaleActions'

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
            value="en">
            English
          </div>
        </div>
      </div>
    )
  }
}
