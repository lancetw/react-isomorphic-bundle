import React, { PropTypes } from 'react'
import Search from './SearchComponent'
import { connect } from 'react-redux'
import * as SearchActions from '../actions/SearchActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

class SearchHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired
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
    const title = this._T('title.search')
    const defaultTitle = this._T('title.site')

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} />
        <Search
          {...this.props}
          defaultLocale={this.getLocale()}
          loadFunc={this.loadFunc} />
      </div>
    )
  }
}

export default connect(state => ({
  search: state.search
}))(SearchHandler)
