import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwtDecode from 'jwt-decode'
import { isArray, isEmpty } from 'lodash'
import moment from 'moment'
import {
  LIST_USER_RELOADED,
  LIST_USER_STARTED,
  LIST_USER_COMPLETED,
  LIST_USER_FAILED,
  BLOCK_USER_STARTED,
  BLOCK_USER_COMPLETED,
  BLOCK_USER_FAILED,
  CHANGE_PASS_USER_STARTED,
  CHANGE_PASS_USER_COMPLETED,
  CHANGE_PASS_USER_FAILED,
  CHANGE_PASS_USER_INITED,
  CHANGE_USER_STARTED,
  CHANGE_USER_COMPLETED,
  CHANGE_USER_FAILED,
  GET_USER_STARTED,
  GET_USER_COMPLETED,
  GET_USER_FAILED
} from 'client/admin/constants/ActionTypes'
import { getToken } from 'client/admin/actions/AuthActions'

async function get (userId, token) {
  return new Promise((resolve, reject) => {
    const user = jwtDecode(token)
    if (!user || !user.isAdmin) reject('invalid token')

    request
      .get(LOCAL_PATH + '/api/admin/v1/users/' + userId)
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

async function update (form, token) {
  return new Promise((resolve, reject) => {
    const user = jwtDecode(token)
    if (!user || !user.isAdmin) reject('invalid token')

    request
      .put('/api/admin/v1/users/' + form.id)
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

async function fetchAll (offset, limit, start, end, keyword, status) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    const user = jwtDecode(token)
    if (!user || !user.isAdmin) reject('invalid token')

    request
      .get(LOCAL_PATH + '/api/admin/v1/users')
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
      .post('/api/admin/v1/users')
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

export function changePassword (form) {
  return async dispatch => {
    dispatch({ type: CHANGE_PASS_USER_STARTED })
    try {
      const token = getToken()
      const info = await update(form, token)
      if (info.email) {
        return dispatch({
          type: CHANGE_PASS_USER_COMPLETED,
          info: info
        })
      } else {
        return dispatch({
          type: CHANGE_PASS_USER_FAILED,
          errors: info.errors ? info.errors : info
        })
      }
    } catch (err) {
      return dispatch({
        type: CHANGE_PASS_USER_FAILED,
        errors: err.message
      })
    }
  }
}

export function change (form) {
  return async dispatch => {
    dispatch({ type: CHANGE_USER_STARTED })
    try {
      const token = getToken()
      let _form = mapValues(form, (v) => isNull(v) ? '' : v)
      if (isNumber(_form.zipcode)) {
        _form.zipcode = '' + _form.zipcode
      }
      if (isEmpty(_form.email)) {
        _form = omit(_form, 'email')
      }
      const user = await updateInfo(_form, token)
      if (user.email) {
        return dispatch({
          type: CHANGE_USER_COMPLETED,
          user: user
        })
      } else {
        return dispatch({
          type: CHANGE_USER_FAILED,
          errors: info.errors ? info.errors : info
        })
      }
    } catch (err) {
      return dispatch({
        type: CHANGE_USER_FAILED,
        errors: err.message
      })
    }
  }
}

export function getDetail (id) {
  return async (dispatch, getState) => {
    dispatch({ type: GET_USER_STARTED })
    try {
      let token = getState().auth.token
      if (isEmpty(token)) {
        token = getToken()
      }
      const detail = await get(id, token)
      if (!isEmpty(detail)) {
        return dispatch({
          type: GET_USER_COMPLETED,
          detail: detail
        })
      } else {
        return dispatch({
          type: GET_USER_FAILED,
          errors: info.errors ? info.errors : info
        })
      }
    } catch (err) {
      return dispatch({
        type: GET_USER_FAILED,
        errors: err.message
      })
    }
  }
}

export function blockUsers (form) {
  return async dispatch => {
    dispatch({ type: BLOCK_USER_STARTED })
    try {
      const token = getToken()
      const res = await send(form, token)
      if (res.done) {
        return dispatch({
          type: BLOCK_USER_COMPLETED
        })
      } else {
        return dispatch({
          type: BLOCK_USER_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: BLOCK_USER_FAILED,
        errors: err.message
      })
    }
  }
}

export function fetchList ({ offset=0, limit=5, start, end, status=0, keyword='', reload=false }) {
  return async (dispatch, getState) => {
    if (reload) {
      dispatch({ type: LIST_USER_RELOADED })
    }

    dispatch({ type: LIST_USER_STARTED })

    try {
      const items = await fetchAll(offset, limit, start, end, keyword, status)
      if (typeof items.rows !== 'undefined' && isArray(items.rows)) {
        return dispatch({
          type: LIST_USER_COMPLETED,
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
          type: LIST_USER_FAILED,
          errors: items.errors ? items.errors : items
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_USER_FAILED,
        errors: err.message
      })
    }
  }
}
