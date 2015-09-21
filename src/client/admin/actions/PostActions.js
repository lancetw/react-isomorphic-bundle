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

async function fetchAll (offset, limit, start, end) {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/admin/v1/posts')
      .query({ offset: offset })
      .query({ limit: limit })
      .query({ start: start })
      .query({ end: end })
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

function _eq (a, b) {
  let _a = a
  let _b = b
  if (typeof _a === 'undefined') _a = null
  if (typeof _b === 'undefined') _b = null

  return (_a === _b)
}

export function fetchList (offset=0, limit=5, start, end, reload) {
  return async (dispatch, getState) => {
    /* cache service */
    const cached = getState().post.posts
    const _start = getState().post.start
    const _end = getState().post.end

    if (!reload && offset <= 0 && !isEmpty(cached)) {
      if (_eq(start, _start) && _eq(end, _end)) {
        return null
      }
    }

    if (reload) {
      dispatch({ type: LIST_POST_RELOADED })
    }

    dispatch({ type: LIST_POST_STARTED })

    try {
      const posts = await fetchAll(offset, limit, start, end)
      if (isArray(posts)) {
        return dispatch({
          type: LIST_POST_COMPLETED,
          posts: posts,
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
