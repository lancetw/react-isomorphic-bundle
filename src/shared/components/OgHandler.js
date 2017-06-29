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
    _T: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
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

  componentDidMount () {
    const { dispatch } = this.props
    const { cid } = this.props.params
    OgActions.fetchOgImage({ cid }).then((url) => {
      if (url) {
        document.body.style.background = 'url("' + url + '"), rgba(252, 173, 49, 1) 64%'
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.style.backgroundSize = '100%'
        document.body.style.backgroundPosition = 'center'
      }
    })
  }

  componentWillUnmount () {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = null
      document.body.style.backgroundImage = null
      document.body.style.backgroundRepeat = null
      document.body.style.backgroundSize = null
    }
  }

  render () {
    const { dispatch, _T } = this.props
    const { getState } = this.context.store
    const protocol = 'https'
    const host = process.env.BROWSER
      ? window.location.host
      : this.context.store.host
    const title = getState().ognearby.oginfo.ocname + ' | ' + _T('title.ogpage')
    const defaultTitle = _T('title.site')
    const meta = []
    meta.push({ 'property': 'og:type', 'content': 'article' })

    const shareInfo = {
      title: `${title} | ${defaultTitle}`,
      url: `${protocol}://${host}${this.props.location.pathname}`
    }

    return (
      <div>
        <Helmet title={`${title} | ${defaultTitle}`} meta={meta} />
        <div id="dot-matrix"></div>
        <Og
          {...this.props}
          shareInfo={shareInfo}
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
