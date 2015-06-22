import request from 'superagent'
import jwt from 'jsonwebtoken'
import { CHANGE_PASS_USER_STARTED, CHANGE_PASS_USER_COMPLETED,
  CHANGE_PASS_USER_FAILED } from 'shared/constants/ActionTypes'
import { getToken } from 'shared/actions/AuthActions'

export function changePassword (form) {
  return async dispatch => {
    dispatch({ type: CHANGE_PASS_USER_STARTED })
    try {
      const token = getToken()
      const info = await update(form, token)
      if (info.email)
        return dispatch({
          type: CHANGE_PASS_USER_COMPLETED,
          info: info
        })
      else
        return dispatch({
          type: CHANGE_PASS_USER_FAILED,
          errors: info.errors ? info.errors : info
        })
    } catch (err) {
      return dispatch({
        type: CHANGE_PASS_USER_FAILED,
        errors: err
      })
    }
  }
}

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
        if (!err && res.body)
          resolve(res.body)
        else
          reject(err)
      })
  })
}
