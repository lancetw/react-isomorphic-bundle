import request from 'superagent'
import LOCAL_PATH from 'shared/utils/localpath'
import { isEmpty, isArray } from 'lodash'
import {
  LIST_OG_POST_RELOADED,
  LIST_OG_POST_STARTED,
  LIST_OG_POST_COMPLETED,
  LIST_OG_POST_FAILED,
  LIST_OG_POST_NEARBY_RELOADED,
  LIST_OG_POST_NEARBY_STARTED,
  LIST_OG_POST_NEARBY_COMPLETED,
  LIST_OG_POST_NEARBY_FAILED
}from 'shared/constants/ActionTypes'

export async function fetchOgImage({ cid }) {
  return new Promise((resolve, reject) => {
    request
      .get('https://church.oursweb.net:51443/img/' + cid)
      .end(function (err, res) {
        if (!err && res.body) {
          if (res.body.img === '/images/churchphoto.gif') resolve(null)
          resolve('https://church.oursweb.net' + res.body.img)
        } else {
          reject(err)
        }
      })
  })
}

async function fetch ({ offset, limit, cid, type, dist }) {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/ogs/' + cid)
      .query({ offset: offset })
      .query({ limit: limit })
      .query({ type: type })
      .query({ dist: dist })
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

export function fetchList (offset=0, limit=5, cid, reload) {
  return async (dispatch, getState) => {
    /* cache service */
    let cached = getState().og.data
    if (!reload
      && offset <= 0
      && !isEmpty(cached)
      && cid === getState().og.cid) {
      return null
    }

    if (reload || cid !== getState().og.cid) {
      dispatch({ type: LIST_OG_POST_RELOADED })
    }

    dispatch({ type: LIST_OG_POST_STARTED })

    try {
      const res = await fetch({ offset, limit, cid, type: 'list' })
      if (res && res.oginfo && isArray(res.data)) {
        return dispatch({
          type: LIST_OG_POST_COMPLETED,
          data: res.data,
          oginfo: res.oginfo,
          offset: offset,
          limit: limit,
          cid: cid
        })
      } else {
        return dispatch({
          type: LIST_OG_POST_FAILED,
          cid: cid,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_OG_POST_FAILED,
        cid: cid,
        errors: err.message
      })
    }
  }
}

export function fetchNearby (dist=1000, limit=5, cid, reload) {
  return async (dispatch, getState) => {
    /* cache service */
    let cached = getState().ognearby.data
    if (!reload
      && !isEmpty(cached)
      && cid === getState().ognearby.cid) {
      return null
    }

    if (reload || cid !== getState().ognearby.cid) {
      dispatch({ type: LIST_OG_POST_NEARBY_RELOADED })
    }

    dispatch({ type: LIST_OG_POST_NEARBY_STARTED })

    try {
      const res = await fetch({ offset: 0, limit, cid, dist, type: 'nearby' })
      if (res && res.oginfo && isArray(res.data)) {
        return dispatch({
          type: LIST_OG_POST_NEARBY_COMPLETED,
          data: res.data,
          pattern: { lat: res.oginfo.lat, lng: res.oginfo.lng, dist: dist },
          oginfo: res.oginfo,
          limit: limit,
          cid: cid
        })
      } else {
        return dispatch({
          type: LIST_OG_POST_NEARBY_FAILED,
          cid: cid,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_OG_POST_NEARBY_FAILED,
        cid: cid,
        errors: err.message
      })
    }
  }
}
