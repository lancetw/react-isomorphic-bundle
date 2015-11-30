import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwtDecode from 'jwt-decode'
import { isArray, isEmpty } from 'lodash'
import moment from 'moment'
import {
  LIST_POST_RELOADED,
  LIST_POST_STARTED,
  LIST_POST_COMPLETED,
  LIST_POST_FAILED,
  MARK_AS_SPAM_STARTED,
  MARK_AS_SPAM_COMPLETED,
  MARK_AS_SPAM_FAILED
} from 'client/admin/constants/ActionTypes'
import { getToken } from 'client/admin/actions/AuthActions'

async function fetchAll (offset, limit, start, end, keyword, status) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    const user = jwtDecode(token)
    if (!user || !user.isAdmin) reject('invalid token')

    request
      .get(LOCAL_PATH + '/api/admin/v1/posts')
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
    const user = jwtDecode(token)
    if (!user || !user.isAdmin) reject('invalid token')
    request
      .post('/api/admin/v1/posts')
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

export function markAsSpam (form) {
  return async dispatch => {
    dispatch({ type: MARK_AS_SPAM_STARTED })
    try {
      const token = getToken()
      const res = await send(form, token)
      if (res.done) {
        return dispatch({
          type: MARK_AS_SPAM_COMPLETED
        })
      } else {
        return dispatch({
          type: MARK_AS_SPAM_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: MARK_AS_SPAM_FAILED,
        errors: err.message
      })
    }
  }
}

export function fetchList ({ offset=0, limit=5, start, end, status=0, keyword='', reload=false }) {
  return async (dispatch, getState) => {
    if (reload) {
      dispatch({ type: LIST_POST_RELOADED })
    }

    dispatch({ type: LIST_POST_STARTED })

    try {
      const items = await fetchAll(offset, limit, start, end, keyword, status)
      if (typeof items.rows !== 'undefined' && isArray(items.rows)) {
        return dispatch({
          type: LIST_POST_COMPLETED,
          items: items.rows,
          count: items.count,
          offset: offset,
          limit: limit,
          start: start,
          end: end,
          status: status,
          keyword: keyword
        })
      } else {
        return dispatch({
          type: LIST_POST_FAILED,
          errors: items.errors ? items.errors : items
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_POST_FAILED,
        errors: err.message
      })
    }
  }
}
