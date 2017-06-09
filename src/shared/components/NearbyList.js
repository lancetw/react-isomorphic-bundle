import React, { Component, PropTypes } from 'react'
import { runGeoLoc } from 'shared/utils/geoloc-utils'
import * as SearchActions from '../actions/SearchActions'
import { connect } from 'react-redux'
import connectI18n from 'shared/components/addon/connect-i18n'
import { Link } from 'react-router'
import { isEmpty } from 'lodash'
import {
  toShortDate
} from 'shared/utils/date-utils'

class NearbyList extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired,
    search: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.releaseTimeout = undefined
    this.releaseTimeout1 = undefined
    this.releaseTimeout2 = undefined
  }

  componentWillMount () {
    const { dispatch } = this.props

    const defaultDistance = 3000
    const center = { lat: 25.0318808, lng: 121.5193721 }
    dispatch(SearchActions.updateNearbyCenter({ center }))

    if (process.env.BROWSER) {
      runGeoLoc(false).then((position) => {
        dispatch(SearchActions.nearby({
          dist: defaultDistance,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }, 50)).then((info) => {
          const { pattern } = info
          this.releaseTimeout = setTimeout(() => {
            dispatch(SearchActions.updateNearbyCenter({
              center: { lat: pattern.lat, lng: pattern.lng }
            }))
          }, 500)
        })
      }).catch((err) => {
        // fallback
        dispatch(SearchActions.nearby({
          dist: defaultDistance,
          lat: center.lat,
          lng: center.lng
        }, 50)).then(() => {
          this.releaseTimeout1 = setTimeout(() => {
            dispatch(SearchActions.updateNearbyCenter({ center }))
          }, 500)
        })
      })
    }
  }

  componentWillUnmount () {
    if (this.op) {
      clearTimeout(this.releaseTimeout)
      clearTimeout(this.releaseTimeout1)
      clearTimeout(this.releaseTimeout2)
    }
  }

  renderList = (posts, isFetching, closeMenu) => {
    const Translate = require('react-translate-component')
    return (
      <div className="item">
        {isFetching &&
        <div className="ui segment basic has-header">
          <div className="ui active inverted dimmer">
            <div className="ui large loader"></div>
          </div>
        </div>
        }

        { !isFetching && !isEmpty(posts) && posts.map(function (item, i) {
          const eventDate = (item.startDate === item.endDate)
          ? toShortDate(item.endDate)
          : toShortDate(item.startDate) + ' ~'
          return (
            <Link key={item.id} className="item" to={`/w/${item.id}`} onClick={closeMenu}>
              <div className="more">
                <h4 className="text">{ item.title }</h4>
                <div className="ui orange horizontal label">
                  { eventDate }
                </div>
                { item.distance && (
                  <div className="ui teal horizontal label">
                    { item.distance >= 1
                      && <Translate content="geoloc.distance.basic.km" dist={item.distance.toFixed(1)}/> }
                    { item.distance < 1 && item.distance >= 0.01
                      && <Translate content="geoloc.distance.basic.m" dist={(item.distance * 1000).toFixed(1)}/> }
                    { item.distance < 0.01
                      && <Translate content="geoloc.distance.basic.here" /> }
                  </div>
                )}
              </div>
            </Link>
          )})
        }
        { !isFetching && isEmpty(posts) && (
          <span>目前沒有相關資訊</span>
        )}
      </div>
    )
  }

  /* eslint-disable max-len */
  render () {
    const { closeMenu, search } = this.props
    return (
      <div>
        <span className="ui header inverted">附近的活動列表</span>
        <div className="ui relaxed divided list inverted">
          {this.renderList(search.data, false, closeMenu)}
        </div>
      </div>
    )
  }
}


export default connect(state => ({
  search: state.search
}))(connectI18n()(NearbyList))
