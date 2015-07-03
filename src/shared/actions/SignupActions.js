import request from 'superagent'
import {
  SIGNUP_USER_STARTED,
  SIGNUP_USER_COMPLETED,
  SIGNUP_USER_FAILED
}from 'shared/constants/ActionTypes'
import { auth, save } from 'shared/actions/AuthActions'

export function submit (form) {
  return async dispatch => {
    dispatch({ type: SIGNUP_USER_STARTED })

    try {
      const res = await sendForm(form)
      if (res.email) {
        const response = await auth(form)
        dispatch(save(response.token))
        return dispatch({
          type: SIGNUP_USER_COMPLETED,
          response: response
        })
      } else return dispatch({
        type: SIGNUP_USER_FAILED,
        errors: res.errors ? res.errors : res
      })
    } catch (err) {
      return dispatch({
        type: SIGNUP_USER_FAILED,
        errors: err.message
      })
    }
  }
}

async function sendForm (form) {
  return new Promise((resolve, reject) => {
    request
      .post('/api/v1/users')
      .send(form)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body)
          resolve(res.body)
        else
          reject(err)
      })
  })
}
