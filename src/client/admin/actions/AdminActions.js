import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwtDecode from 'jwt-decode'
import { isArray, isEmpty } from 'lodash'
import moment from 'moment'
import {
  LIST_ADMIN_RELOADED,
  LIST_ADMIN_STARTED,
  LIST_ADMIN_COMPLETED,
  LIST_ADMIN_FAILED,
  BLOCK_ADMIN_STARTED,
  BLOCK_ADMIN_COMPLETED,
  BLOCK_ADMIN_FAILED,
  CREATE_ADMIN_STARTED,
  CREATE_ADMIN_COMPLETED,
  CREATE_ADMIN_FAILED,
  DELETE_ADMIN_STARTED,
  DELETE_ADMIN_COMPLETED,
  DELETE_ADMIN_FAILED,
  CHANGE_PASS_ADMIN_STARTED,
  CHANGE_PASS_ADMIN_COMPLETED,
  CHANGE_PASS_ADMIN_FAILED
} from 'client/admin/constants/ActionTypes'
import { getToken } from 'client/admin/actions/AuthActions'

async function fetchAll (offset, limit, keyword, status) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    const user = jwtDecode(token)
    if (!user || !user.isAdmin) reject('invalid token')

    request
      .get(LOCAL_PATH + '/api/admin/v1/admins')
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .query({ offset: offset })
      .query({ limit: limit })
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
      .post('/api/admin/v1/admins')
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

async function update (form, token) {
  return new Promise((resolve, reject) => {
    const user = jwtDecode(token)
    if (!user || !user.isAdmin) reject('invalid token')

    request
      .put('/api/admin/v1/admins/' + form.id)
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
    const user = jwtDecode(token)
    if (!user || !user.isAdmin) reject('invalid token')
    request
      .del('/api/admin/v1/admins/' + id)
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

export function blockAdmins (form) {
  return async dispatch => {
    dispatch({ type: BLOCK_ADMIN_STARTED })
    try {
      const token = getToken()
      const res = await send(form, token)
      if (res.done) {
        return dispatch({
          type: BLOCK_ADMIN_COMPLETED
        })
      } else {
        return dispatch({
          type: BLOCK_ADMIN_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: BLOCK_ADMIN_FAILED,
        errors: err.message
      })
    }
  }
}

export function fetchList ({ offset=0, limit=5, status=0, keyword='', reload=false }) {
  return async (dispatch, getState) => {
    if (reload) {
      dispatch({ type: LIST_ADMIN_RELOADED })
    }

    dispatch({ type: LIST_ADMIN_STARTED })

    try {
      const items = await fetchAll(offset, limit, keyword, status)
      if (typeof items.rows !== 'undefined' && isArray(items.rows)) {
        return dispatch({
          type: LIST_ADMIN_COMPLETED,
          items: items.rows,
          count: items.count,
          offset: offset,
          limit: limit,
          status: status,
          keyword: keyword
        })
      } else {
        return dispatch({
          type: LIST_ADMIN_FAILED,
          errors: items.errors ? items.errors : items
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_ADMIN_FAILED,
        errors: err.message
      })
    }
  }
}

export function submit (form) {
  return async dispatch => {
    try {
      const token = getToken()
      const res = await send(form, token)
      if (res.email) {
        return dispatch({
          type: CREATE_ADMIN_COMPLETED,
          admin: res
        })
      } else {
        return dispatch({
          type: CREATE_ADMIN_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: CREATE_ADMIN_FAILED,
        errors: err.message
      })
    }
  }
}

export function changePassword (form) {
  return async dispatch => {
    dispatch({ type: CHANGE_PASS_ADMIN_STARTED })
    try {
      const token = getToken()
      const res = await update(form, token)
      if (res.email) {
        return dispatch({
          type: CHANGE_PASS_ADMIN_COMPLETED,
          admin: res
        })
      } else {
        return dispatch({
          type: CHANGE_PASS_ADMIN_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: CHANGE_PASS_ADMIN_FAILED,
        errors: err.message
      })
    }
  }
}

export function deport (id) {
  return async dispatch => {
    dispatch({ type: DELETE_ADMIN_STARTED })
    try {
      const token = getToken()
      const admin = await remove(id, token)

      if (admin.email) {
        return dispatch({
          type: DELETE_ADMIN_COMPLETED
        })
      } else {
        return dispatch({
          type: DELETE_ADMIN_FAILED,
          errors: admin.errors ? admin.errors : admin
        })
      }
    } catch (err) {
      return dispatch({
        type: DELETE_ADMIN_FAILED,
        errors: err.message
      })
    }
  }
}
