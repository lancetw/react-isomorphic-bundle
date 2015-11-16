import React, { Component, PropTypes } from 'react'
import Search from './SearchComponent'
import { connect } from 'react-redux'
import * as SearchActions from '../actions/SearchActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'

class SearchHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    _T: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch } = this.props

    dispatch(updateTitle('title.search'))
  }

  loadFunc = () => {
    const { dispatch, search } = this.props

    dispatch(SearchActions
      .searchPost(search.pattern, search.offset, search.limit))
  }

  render () {
    const { _T } = this.props
    const title = _T('title.search')
    const defaultTitle = _T('title.site')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Search
          {...this.props}
          loadFunc={this.loadFunc} />
      </div>
    )
  }
}

export default connect(state => ({
  search: state.search
}))(connectI18n()(SearchHandler))
