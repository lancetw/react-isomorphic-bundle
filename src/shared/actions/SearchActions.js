import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import { isArray } from 'lodash'
import {
  SEARCH_POST_RELOADED,
  SEARCH_POST_STARTED,
  SEARCH_POST_COMPLETED,
  SEARCH_POST_FAILED,
  SEARCH_NEARBY_RELOADED,
  SEARCH_NEARBY_STARTED,
  SEARCH_NEARBY_COMPLETED,
  SEARCH_NEARBY_FAILED,
  SEARCH_UPDATE_CENTER_COMPLETED
} from 'shared/constants/ActionTypes'

async function search (scope, pattern, offset, limit) {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/searches')
      .query({ offset: offset })
      .query({ limit: limit })
      .query({ scope: scope })
      .query({ pattern: pattern })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

export function searchPost (pattern, offset=0, limit=10, reload=false) {
  return async (dispatch, getState) => {
    /* cache service */
    let _pattern = getState().search.pattern
    if (!reload && offset <= 0 && _pattern === pattern) {
      return null
    }

    if (reload) {
      dispatch({ type: SEARCH_POST_RELOADED })
    }

    dispatch({ type: SEARCH_POST_STARTED })
    try {
      const data = await search('post', pattern, offset, limit)
      if (isArray(data)) {
        return dispatch({
          type: SEARCH_POST_COMPLETED,
          pattern: pattern,
          data: data,
          offset: offset,
          limit: limit
        })
      } else {
        return dispatch({
          type: SEARCH_POST_FAILED,
          errors: data.errors ? data.errors : data
        })
      }
    } catch (err) {
      return dispatch({
        type: SEARCH_POST_FAILED,
        errors: err.message
      })
    }
  }
}

export function nearby (pattern, limit=30, reload=false) {
  return async (dispatch, getState) => {
    /* cache service */
    let _pattern = getState().search.pattern
    if (!reload
        && _pattern.lat === pattern.lat
        && _pattern.lng === pattern.lng
        && _pattern.dist === pattern.dist) {
      return null
    }

    if (reload) {
      dispatch({ type: SEARCH_NEARBY_RELOADED })
    }

    dispatch({ type: SEARCH_NEARBY_STARTED })
    try {
      const data = await search('nearby', JSON.stringify(pattern), 0, limit)
      if (isArray(data)) {
        return dispatch({
          type: SEARCH_NEARBY_COMPLETED,
          pattern: pattern,
          data: data,
          offset: 0,
          limit: limit
        })
      } else {
        return dispatch({
          type: SEARCH_NEARBY_FAILED,
          pattern: pattern,
          errors: data.errors ? data.errors : data
        })
      }
    } catch (err) {
      return dispatch({
        type: SEARCH_NEARBY_FAILED,
        errors: err.message
      })
    }
  }
}

export function updateNearbyCenter ({ center }) {
  return async (dispatch, getState) => {
    return dispatch({
      type: SEARCH_UPDATE_CENTER_COMPLETED,
      center: center
    })
  }
}
