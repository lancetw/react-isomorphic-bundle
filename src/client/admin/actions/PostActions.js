import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwt from 'jsonwebtoken'
import { isArray, isEmpty } from 'lodash'
import moment from 'moment'
import {
  LIST_POST_RELOADED,
  LIST_POST_STARTED,
  LIST_POST_COMPLETED,
  LIST_POST_FAILED
} from 'client/admin/constants/ActionTypes'
import { getToken } from 'client/admin/actions/AuthActions'
import { EQUAL } from 'shared/utils/common-utils'

async function fetchAll (offset, limit, start, end, status) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    const user = jwt.decode(token)
    if (!user.isAdmin) reject('invalid token')

    request
      .get(LOCAL_PATH + '/api/admin/v1/posts')
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .query({ offset: offset })
      .query({ limit: limit })
      .query({ start: start })
      .query({ end: end })
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

export function fetchList (offset=0, limit=5, start, end, status, reload) {
  return async (dispatch, getState) => {
    /* cache service */
    const _start = getState().post.start
    const _end = getState().post.end

    if (reload) {
      dispatch({ type: LIST_POST_RELOADED })
    }

    dispatch({ type: LIST_POST_STARTED })

    try {
      const posts = await fetchAll(offset, limit, start, end, status)
      if (typeof posts.rows !== 'undefined' && isArray(posts.rows)) {
        return dispatch({
          type: LIST_POST_COMPLETED,
          posts: posts.rows,
          count: posts.count,
          offset: offset,
          limit: limit,
          start: start,
          end: end
        })
      } else {
        return dispatch({
          type: LIST_POST_FAILED,
          errors: posts.errors ? posts.errors : posts
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
