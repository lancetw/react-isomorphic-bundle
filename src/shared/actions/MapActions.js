import request from 'superagent'
import {
  MAP_INITED,
  SET_MAP_PIN_STARTED,
  SET_MAP_PIN_COMPLETED,
  SET_MAP_PIN_FAILED,
  SET_MAP_GEO_STARTED,
  SET_MAP_GEO_COMPLETED,
  SET_MAP_GEO_FAILED,
  FIND_MAP_PLACE_STARTED,
  FIND_MAP_PLACE_COMPLETED,
  FIND_MAP_PLACE_FAILED
} from 'shared/constants/ActionTypes'

export function init () {
  return async dispatch => {
    return dispatch({ type: MAP_INITED })
  }
}

export function reload () {
  return async dispatch => {
    return dispatch({ type: SET_MAP_PIN_STARTED })
  }
}

export function updateGeo ({ lat, lng }) {
  return async dispatch => {
    return dispatch({
      type: SET_MAP_GEO_COMPLETED,
      lat_: lat,
      lng_: lng
    })
  }
}

export function setPin ({ lat, lng, place }) {
  return async dispatch => {
    return dispatch({
      type: SET_MAP_PIN_COMPLETED,
      lat: lat,
      lng: lng,
      place: place
    })
  }
}

export function search (address) {
  return async dispatch => {
    try {
      const res = await searchForm(address)
      if (res && typeof res.results !== 'undefined') {
        const { lat, lng } = res.results[0].geometry.location
        return dispatch({
          type: FIND_MAP_PLACE_COMPLETED,
          lat: lat,
          lng: lng,
          place: address
        })
      } else return dispatch({
        type: FIND_MAP_PLACE_FAILED,
        errors: 'google data error'
      })

    } catch (err) {
      return dispatch({
        type: FIND_MAP_PLACE_FAILED,
        errors: err
      })
    }
  }
}

/* eslint-disable max-len */
async function searchForm (address) {
  return new Promise((resolve, reject) => {
    request
      .get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body)
          resolve(res.body)
        else
          reject(err)
      })
  })
}


