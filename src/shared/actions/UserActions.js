import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwt from 'jsonwebtoken'
import {
  CHANGE_PASS_USER_STARTED,
  CHANGE_PASS_USER_COMPLETED,
  CHANGE_PASS_USER_FAILED,
  CHANGE_PASS_USER_INITED,
  CHANGE_INFO_USER_STARTED,
  CHANGE_INFO_USER_COMPLETED,
  CHANGE_INFO_USER_FAILED,
  GET_INFO_USER_STARTED,
  GET_INFO_USER_COMPLETED,
  GET_INFO_USER_FAILED
} from 'shared/constants/ActionTypes'
import { getToken } from 'shared/actions/AuthActions'
import { isEmpty, isNumber, isNull, mapValues, omit } from 'lodash'

async function update (form, token) {
  return new Promise((resolve, reject) => {
    const user = jwt.decode(token)
    if (!user.id) reject('invalid token')
    const userId = user.id
    request
      .put('/api/v1/users/' + userId)
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

async function get (token) {
  return new Promise((resolve, reject) => {
    const user = jwt.decode(token)
    if (!user.id) reject('invalid token')
    const userId = user.id
    request
      .get(LOCAL_PATH + '/api/v1/usersinfo/' + userId)
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

async function updateInfo (form, token) {
  return new Promise((resolve, reject) => {
    const user = jwt.decode(token)
    if (!user.id) reject('invalid token')
    const userId = user.id
    request
      .put('/api/v1/usersinfo/' + userId)
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

export function changePasswordInit (form) {
  return async dispatch => {
    return dispatch({
      type: CHANGE_PASS_USER_INITED
    })
  }
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

export function changeInfo (form) {
  return async dispatch => {
    dispatch({ type: CHANGE_INFO_USER_STARTED })
    try {
      const token = getToken()
      let _form = mapValues(form, (v) => isNull(v) ? '' : v)
      if (isNumber(_form.zipcode)) {
        _form.zipcode = '' + _form.zipcode
      }
      if (isEmpty(_form.email)) {
        _form = omit(_form, 'email')
      }
      const info = await updateInfo(_form, token)
      if (info.ocname) {
        return dispatch({
          type: CHANGE_INFO_USER_COMPLETED,
          info: info
        })
      } else {
        return dispatch({
          type: CHANGE_INFO_USER_FAILED,
          errors: info.errors ? info.errors : info
        })
      }
    } catch (err) {
      return dispatch({
        type: CHANGE_INFO_USER_FAILED,
        errors: err.message
      })
    }
  }
}

export function getInfo () {
  return async (dispatch, getState) => {
    dispatch({ type: GET_INFO_USER_STARTED })
    try {
      let token = getState().auth.token
      if (isEmpty(token)) {
        token = getToken()
      }
      const info = await get(token)
      if (!isEmpty(info)) {
        return dispatch({
          type: GET_INFO_USER_COMPLETED,
          info: info
        })
      } else {
        return dispatch({
          type: GET_INFO_USER_FAILED,
          errors: info.errors ? info.errors : info
        })
      }
    } catch (err) {
      return dispatch({
        type: GET_INFO_USER_FAILED,
        errors: err.message
      })
    }
  }
}

