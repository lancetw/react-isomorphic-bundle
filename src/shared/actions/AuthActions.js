import request from 'superagent'
import { isEmpty } from 'lodash'
import {
  AUTH_USER_STARTED,
  AUTH_USER_COMPLETED,
  AUTH_USER_FAILED,
  REVOKE_USER_COMPLETED,
  REVOKE_USER_FAILED
} from 'shared/constants/ActionTypes'

export function save (token) {
  return async dispatch => {
    dispatch({ type: AUTH_USER_STARTED })
    try {
      setToken(token)

      return dispatch({
        type: AUTH_USER_COMPLETED,
        token: token
      })
    } catch (err) {
      return dispatch({
        type: AUTH_USER_FAILED,
        errors: err
      })
    }
  }
}

export function load () {
  return async dispatch => {
    dispatch({ type: AUTH_USER_STARTED })
    try {
      const token = getToken()
      return dispatch({
        type: AUTH_USER_COMPLETED,
        token: token
      })
    } catch (err) {
      return dispatch({
        type: AUTH_USER_FAILED,
        errors: err
      })
    }
  }
}

export function login (form) {
  return async dispatch => {
    dispatch({ type: AUTH_USER_STARTED })
    try {
      const res = await auth(form)
      if (!isEmpty(res.token))
        return dispatch({
          type: AUTH_USER_COMPLETED,
          token: res.token
        })
      else
        throw 'no token'

    } catch (err) {
      return dispatch({
        type: AUTH_USER_FAILED,
        errors: err
      })
    }
  }
}

export function logout () {
  return async dispatch => {
    try {
      const res = await revoke()
      if (res && res.revoke) {
        clearToken()
        return dispatch({
          type: REVOKE_USER_COMPLETED
        })
      } else
        throw 'revoke error'

    } catch (err) {
      return dispatch({
        type: REVOKE_USER_FAILED,
        errors: err
      })
    }
  }
}

export function setToken (token) {
  if (typeof localStorage !== 'undefined'
      && localStorage !== null)
    if (token && token !== 'undefined')
      localStorage.setItem('token', token)
}

export function getToken () {
  let token = ''
  if (typeof localStorage !== 'undefined'
      && localStorage !== null)
    token = localStorage.getItem('token')

  return token
}

export function clearToken () {
  if (typeof localStorage !== 'undefined'
      && localStorage !== null)
    localStorage.setItem('token', '')
}

export async function auth (form) {
  return new Promise((resolve, reject) => {
    request
      .post('/api/v1/login')
      .set('Accept', 'application/json')
      .auth(form.email, form.password)
      .end(function (err, res) {
        if (!err && res.body)
          resolve(res.body)
        else
          reject(err)
      })
  })
}

export async function revoke () {
  return new Promise((resolve, reject) => {
    request
      .get('/api/v1/logout')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body)
          resolve(res.body)
        else
          reject(err)
      })
  })
}

