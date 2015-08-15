import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwt from 'jsonwebtoken'
import { isArray } from 'lodash'
import {
  SEARCH_POST_STARTED,
  SEARCH_POST_COMPLETED,
  SEARCH_POST_FAILED
} from 'shared/constants/ActionTypes'

export function searchPost (pattern, offset=0, limit=10, reload=false) {
  return async dispatch => {
    if (reload)
      dispatch({ type: SEARCH_POST_STARTED })
    try {
      const data = await search('post', pattern, offset, limit)
      if (isArray(data))
        return dispatch({
          type: SEARCH_POST_COMPLETED,
          pattern: pattern,
          data: data
        })
      else
        return dispatch({
          type: SEARCH_POST_FAILED,
          errors: data.errors ? data.errors : data
        })
    } catch (err) {
      return dispatch({
        type: SEARCH_POST_FAILED,
        errors: err.message
      })
    }
  }
}

async function search (scope, pattern, offset, limit) {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/searches')
      .query({ offset: offset })
      .query({ limit: limit })
      .query({ scope: scope })
      .query({ pattern: pattern })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body)
          resolve(res.body)
        else
          reject(err)
      })
  })
}
