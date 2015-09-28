import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwt from 'jsonwebtoken'
import { isArray, isEmpty } from 'lodash'
import moment from 'moment'
import {
  LIST_AD_RELOADED,
  LIST_AD_STARTED,
  LIST_AD_COMPLETED,
  LIST_AD_FAILED,
  CREATE_AD_STARTED,
  CREATE_AD_COMPLETED,
  CREATE_AD_FAILED,
  DELETE_AD_STARTED,
  DELETE_AD_COMPLETED,
  DELETE_AD_FAILED
} from 'client/admin/constants/ActionTypes'
import { getToken } from 'client/admin/actions/AuthActions'

async function fetchAll (offset, limit, start, end, keyword, status) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    const user = jwt.decode(token)
    if (!user || !user.isAdmin) reject('invalid token')

    request
      .get(LOCAL_PATH + '/api/admin/v1/promotions')
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .query({ offset: offset })
      .query({ limit: limit })
      .query({ start: start })
      .query({ end: end })
      .query({ keyword: keyword })
      .query({ status: status })
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

async function send (form, token) {
  return new Promise((resolve, reject) => {
    const user = jwt.decode(token)
    if (!user || !user.isAdmin) reject('invalid token')
    request
      .post('/api/admin/v1/promotions')
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .send(form)
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

async function remove (id, token) {
  return new Promise((resolve, reject) => {
    const user = jwt.decode(token)
    if (!user || !user.isAdmin) reject('invalid token')
    request
      .del('/api/admin/v1/promotions/' + id)
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

export function fetchList ({ offset=0, limit=5, reload=false }) {
  return async (dispatch, getState) => {
    if (reload) {
      dispatch({ type: LIST_AD_RELOADED })
    }

    dispatch({ type: LIST_AD_STARTED })

    try {
      const items = await fetchAll(offset, limit)
      if (typeof items.rows !== 'undefined' && isArray(items.rows)) {
        return dispatch({
          type: LIST_AD_COMPLETED,
          items: items.rows,
          count: items.count,
          offset: offset,
          limit: limit
        })
      } else {
        return dispatch({
          type: LIST_AD_FAILED,
          errors: items.errors ? items.errors : items
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_AD_FAILED,
        errors: err.message
      })
    }
  }
}

export function submit (form) {
  return async dispatch => {
    dispatch({ type: CREATE_AD_STARTED })
    try {
      const token = getToken()
      const res = await send(form, token)
      if (res.script) {
        return dispatch({
          type: CREATE_AD_COMPLETED,
          ad: res
        })
      } else {
        return dispatch({
          type: CREATE_AD_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: CREATE_AD_FAILED,
        errors: err.message
      })
    }
  }
}

export function cancel (id) {
  return async dispatch => {
    dispatch({ type: DELETE_AD_STARTED })
    try {
      const token = getToken()
      const res = await remove(id, token)

      if (res.script) {
        return dispatch({
          type: DELETE_AD_COMPLETED
        })
      } else {
        return dispatch({
          type: DELETE_AD_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: DELETE_AD_FAILED,
        errors: err.message
      })
    }
  }
}
