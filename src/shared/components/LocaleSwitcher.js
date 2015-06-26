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
    counterpart.setLocale(e.target.value)
    this.props.dispatch(
      LocaleActions.sync(e.target.value)
    )
  }

  render () {
    return (
      <div className="item ui locale-switcher">
        <select id="locale"
          defaultValue={counterpart.getLocale()}
          onChange={this.handleChange}>
          <option value="zh-hant-tw">正體中文</option>
          <option value="en">English</option>
        </select>
      </div>
    )
  }
}

