import request from 'superagent'
import {
  AUTH_USER_STARTED,
  AUTH_USER_COMPLETED,
  AUTH_USER_FAILED,
  SHOW_USER_COMPLETED,
  SHOW_USER_FAILED,
  REVOKE_USER_COMPLETED,
  REVOKE_USER_FAILED,
  SYNC_SERVER_USER_COMPLETED,
  SYNC_CLIENT_USER_COMPLETED,
  CHECK_TOKEN_COMPLETED,
  CHECK_TOKEN_FAILED
} from 'client/admin/constants/ActionTypes'
import jwtDecode from 'jwt-decode'

export function setToken (token) {
  if (typeof localStorage === 'undefined') {
    throw Error('no localStorage')
  } else {
    if (!token) {
      throw Error('localStorage data is falsy')
    } else {
      localStorage.setItem('token', token)
    }
  }
}

export function getToken () {
  let token = ''
  if (typeof localStorage === 'undefined') {
    throw Error('no localStorage')
  } else {
    token = localStorage.getItem('token')
  }
  return token
}

export function checkToken () {   // just check token expire field
  return async dispatch => {
    try {
      const decoded = jwtDecode(getToken())
      const now = Math.round(+new Date() / 1000)  // Unix Timestamp
      const expired = decoded.exp <= now
      const isAdmin = !!decoded.isAdmin
      if (!expired) {
        return dispatch({
          type: CHECK_TOKEN_COMPLETED,
          verified: isAdmin
        })
      } else {
        throw new Error('verification failed')
      }
    } catch (err) {
      return dispatch({
        type: CHECK_TOKEN_FAILED,
        errors: err.message
      })
    }
  }
}

export function clearToken () {
  if (typeof localStorage === 'undefined') {
    throw Error('no localStorage')
  } else {
    localStorage.setItem('token', '')
  }
}

export function showUser (token) {
  return async dispatch => {
    try {
      const decoded = jwtDecode(token)
      const now = Math.round(+new Date() / 1000)  // Unix Timestamp
      const expired = decoded.exp <= now
      const isAdmin = !!decoded.isAdmin
      if (!expired && isAdmin) {
        return dispatch({
          type: SHOW_USER_COMPLETED,
          user: decoded
        })
      } else {
        throw new Error('verification failed')
      }
    } catch (err) {
      return dispatch({
        type: SHOW_USER_FAILED,
        errors: err.message
      })
    }
  }
}

export async function auth (form) {
  return new Promise((resolve, reject) => {
    request
      .post('/api/admin/v1/login')
      .set('Accept', 'application/json')
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

export async function verify () {
  return new Promise((resolve, reject) => {
    request
      .post('/auth/token/verify')
      .set('Accept', 'application/json')
      .send({ token: getToken() })
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

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
        errors: err.message
      })
    }
  }
}

export function sync (token) {
  return async dispatch => {
    if (process.env.BROWSER) {
      return dispatch({
        type: SYNC_CLIENT_USER_COMPLETED,
        token: getToken(),
        errors: {}
      })
    } else {
      return dispatch({
        type: SYNC_SERVER_USER_COMPLETED,
        token: token,
        errors: {}
      })
    }
  }
}

export function login (form) {
  return async dispatch => {
    dispatch({ type: AUTH_USER_STARTED })
    try {
      const res = await auth(form)
      if (res && res.token) {
        setToken(res.token)
        return dispatch({
          type: AUTH_USER_COMPLETED,
          token: res.token
        })
      } else throw new Error('no token')
    } catch (err) {
      return dispatch({
        type: AUTH_USER_FAILED,
        errors: err.message
      })
    }
  }
}

export function logout () {
  return async dispatch => {
    try {
      clearToken()
      return dispatch({
        type: REVOKE_USER_COMPLETED
      })
    } catch (err) {
      return dispatch({
        type: REVOKE_USER_FAILED,
        errors: err.message
      })
    }
  }
}
