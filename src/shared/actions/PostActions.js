import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwt from 'jsonwebtoken'
import { isArray, clone } from 'lodash'
import moment from 'moment'
import {
  CREATE_POST_STARTED,
  CREATE_POST_COMPLETED,
  CREATE_POST_FAILED,
  LIST_POST_STARTED,
  LIST_POST_COMPLETED,
  LIST_POST_FAILED
} from 'shared/constants/ActionTypes'
import { getToken } from 'shared/actions/AuthActions'

export function submit (form) {
  return async dispatch => {
    dispatch({ type: CREATE_POST_STARTED })

    try {
      const token = getToken()
      const content = await create(form, token)

      if (content.uid)
        return dispatch({
          type: CREATE_POST_COMPLETED,
          content: content
        })
      else
        return dispatch({
          type: CREATE_POST_FAILED,
          errors: content.errors ? content.errors : content
        })
    } catch (err) {
      return dispatch({
        type: CREATE_POST_FAILED,
        errors: err
      })
    }
  }
}

export function showList () {
  return async dispatch => {
    dispatch({ type: LIST_POST_STARTED })
    try {
      const posts = await list()
      if (isArray(posts))
        return dispatch({
          type: LIST_POST_COMPLETED,
          posts: posts
        })
      else
        return dispatch({
          type: LIST_POST_FAILED,
          errors: posts.errors ? posts.errors : posts
        })
    } catch (err) {
      return dispatch({
        type: LIST_POST_FAILED,
        errors: err
      })
    }
  }
}

async function create (form, token) {
  return new Promise((resolve, reject) => {
    const user = jwt.decode(token)
    if (!user.id) reject('invalid token')
    const _form = clone(form)
    _form.uid = user.id
    _form.startDate = moment(_form.startDate).format('YYYY-MM-DD')
    _form.endDate = moment(_form.endDate).format('YYYY-MM-DD')
    request
      .post('/api/v1/posts')
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .send(_form)
      .end(function (err, res) {
        if (!err && res.body)
          resolve(res.body)
        else
          reject(err)
      })
  })
}

async function list () {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/posts')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body)
          resolve(res.body)
        else
          reject(err)
      })
  })
}

