import React, { PropTypes } from 'react'
import Og from './OgComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as OgActions from '../actions/OgActions'
import * as SearchActions from '../actions/SearchActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import { BaseComponent } from 'shared/components'

class OgHandler extends BaseComponent {

  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.object.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
    translator: PropTypes.object
  }

  constructor (props, context) {
    super(props)
    const { dispatch, resolver } = context.store

    this.ogActions = bindActionCreators(OgActions, dispatch)

    const { cid } = props.params
    if (cid) {
      const limit = 10
      resolver.resolve(this.ogActions.fetchList, 0, limit, cid)
      resolver.resolve(this.ogActions.fetchNearby, 10000, limit, cid)

      dispatch(updateTitle('title.ogpage'))
    }
  }

  render () {
    const { dispatch } = this.props
    const { getState } = this.context.store
    const title = getState().og.oginfo.ocname + ' | ' + this._T('title.ogpage')
    const defaultTitle = this._T('title.site')
    const meta = []
    meta.push({ 'property': 'og:type', 'content': 'article' })

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} meta={meta} />
        <Og
          {...this.props}
          {...bindActionCreators(SearchActions, dispatch)}
          defaultLocale={this.getLocale()}
        />
      </div>
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  user: state.user,
  og: state.og,
  ognearby: state.ognearby
}))(OgHandler)
