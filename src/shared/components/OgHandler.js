import React, { Component, PropTypes } from 'react'
import Og from './OgComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as OgActions from '../actions/OgActions'
import * as SearchActions from '../actions/SearchActions'
import { updateTitle } from '../actions/LocaleActions'
import Helmet from 'react-helmet'
import connectI18n from 'shared/components/addon/connect-i18n'

class OgHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    params: PropTypes.object.isRequired,
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
    const { store: { resolver } } = this.context

    this.ogActions = bindActionCreators(OgActions, dispatch)

    const { cid } = this.props.params
    if (cid) {
      const limit = 10
      resolver.resolve(this.ogActions.fetchList, 0, limit, cid)
      resolver.resolve(this.ogActions.fetchNearby, 10000, limit, cid)

      dispatch(updateTitle('title.ogpage'))
    }
  }

  render () {
    const { dispatch, _T } = this.props
    const { getState } = this.context.store
    const title = getState().ognearby.oginfo.ocname + ' | ' + _T('title.ogpage')
    const defaultTitle = _T('title.site')
    const meta = []
    meta.push({ 'property': 'og:type', 'content': 'article' })

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} meta={meta} />
        <Og
          {...this.props}
          {...bindActionCreators(SearchActions, dispatch)}
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
}))(connectI18n()(OgHandler))
