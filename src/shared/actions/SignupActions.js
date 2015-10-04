import request from 'superagent'
import {
  SIGNUP_USER_STARTED,
  SIGNUP_USER_COMPLETED,
  SIGNUP_USER_FAILED,
  GET_SITE_KEY_COMPLETED,
  GET_SITE_KEY_FAILED
}from 'shared/constants/ActionTypes'
import { auth, save } from 'shared/actions/AuthActions'

async function sendForm (form) {
  return new Promise((resolve, reject) => {
    request
      .post('/api/v1/users')
      .send(form)
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

async function get () {
  return new Promise((resolve, reject) => {
    request
      .get('/api/v1/users')
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

export async function verify (form) {
  return new Promise((resolve, reject) => {
    request
      .post('https://www.google.com/recaptcha/api/siteverify')
      .type('form')
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

export function init () {
  return async dispatch => {
    return dispatch({ type: SIGNUP_USER_STARTED })
  }
}

export function submit (form) {
  return async dispatch => {
    try {
      const res = await sendForm(form)
      if (res.email) {
        const response = await auth(form)
        dispatch(save(response.token))
        return dispatch({
          type: SIGNUP_USER_COMPLETED,
          response: response
        })
      } else {
        return dispatch({
          type: SIGNUP_USER_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: SIGNUP_USER_FAILED,
        errors: err.message
      })
    }
  }
}

export function getSiteKey () {
  return async dispatch => {
    try {
      const res = await get()
      if (res.sitekey) {
        return dispatch({
          type: GET_SITE_KEY_COMPLETED,
          sitekey: res.sitekey
        })
      } else {
        return dispatch({
          type: GET_SITE_KEY_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: GET_SITE_KEY_FAILED,
        errors: err.message
      })
    }
  }
}
