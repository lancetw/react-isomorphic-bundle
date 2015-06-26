import React, { PropTypes } from 'react'
import counterpart from 'counterpart'
import DocumentTitle from 'shared/components/addon/document-title'
import * as LocaleActions from '../actions/AuthActions'

export default class LocaleSwitcher extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    translator: PropTypes.object.isRequired
  }

  handleChange (e) {
    counterpart.setLocale(e.target.value)
    const { dispatch } = this.props
    dispatch(LocaleActions.sync(e.target.value))
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

