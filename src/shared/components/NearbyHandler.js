import React, { PropTypes } from 'react'
import Nearby from './NearbyComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as SearchActions from '../actions/SearchActions'
import { updateTitle } from '../actions/LocaleActions'
import DocumentTitle from './addon/document-title'
import { BaseComponent } from 'shared/components'
import { runGeoLoc } from 'shared/utils/geoloc-utils'

class NearbyHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch } = context.store
    dispatch(updateTitle('title.nearby'))

    runGeoLoc((position) => {
      dispatch(SearchActions.nearby(
        {
          dist: 5000,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        30
      ))
    })
  }

  render () {
    const { dispatch } = this.props

    const title = this._T('title.nearby')
    const defaultTitle = this._T('title.site')

    return (
      <DocumentTitle title={title} defaultTitle={defaultTitle}>
        <Nearby
          {...this.props}
          {...bindActionCreators(SearchActions, dispatch)}
          defaultLocale={this.getLocale()}
        />
      </DocumentTitle>
    )
  }
}

export default connect(state => ({
  search: state.search
}))(NearbyHandler)
