import React, { PropTypes } from 'react'
import Ads from './AdsComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AdActions from 'client/admin/actions/AdActions'

class AdsHandler extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props)
    const { dispatch } = props
    dispatch(AdActions.fetchList({ offset: 0, limit: 10 }))

    this.state = { page: { selected: 0 } }
  }

  render () {
    const { dispatch } = this.props
    return (
      <Ads
        {...bindActionCreators(AdActions, dispatch)}
        {...this.props}
        menuIndex={2}
      />
    )
  }
}

export default connect(state => ({
  collect: state.ad
}))(AdsHandler)
