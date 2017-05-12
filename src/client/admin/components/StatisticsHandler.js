import React, { Component, PropTypes } from 'react'
import Statistics from './StatisticsComponent'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as StatisticActions from 'client/admin/actions/StatisticActions'
import * as AuthActions from 'client/admin/actions/AuthActions'
import moment from 'moment'

class StatisticsHandler extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    collect: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
  }

  componentWillMount () {
    const { dispatch } = this.props
    const { year, month } = this.props.collect
    dispatch(StatisticActions.fetchData({ year, month }))
  }

  render () {
    const { dispatch } = this.props
    return (
      <Statistics
        {...bindActionCreators(StatisticActions, dispatch)}
        menuIndex={2}
        {...this.props}
      />
    )
  }
}

export default connect(state => ({
  auth: state.auth,
  collect: state.statistic
}))(StatisticsHandler)
