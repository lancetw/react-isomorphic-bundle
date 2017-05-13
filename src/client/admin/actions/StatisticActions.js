import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwtDecode from 'jwt-decode'
import { isArray, isEmpty } from 'lodash'
import moment from 'moment'
import {
  LOAD_STATISTICS_STARTED,
  LOAD_STATISTICS_COMPLETED,
  LOAD_STATISTICS_FAILED
} from 'client/admin/constants/ActionTypes'
import { getToken } from 'client/admin/actions/AuthActions'

async function fetch (year, month) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    const user = jwtDecode(token)
    if (!user || !user.isAdmin) reject('invalid token')

    request
      .get(LOCAL_PATH + '/api/admin/v1/statistics')
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .query({ year: year })
      .query({ month: month })
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

export function fetchData (year, month) {
  return async (dispatch, getState) => {
    dispatch({ type: LOAD_STATISTICS_STARTED })

    try {
      const items = await fetch(year, month)
      if (typeof items.rows !== 'undefined' && isArray(items.rows)) {
        return dispatch({
          type: LOAD_STATISTICS_COMPLETED,
          year: year,
          month: month,
          items: items.rows,
          countUsers: items.countUsers,
          countPosts: items.countPosts,
          data: items.data
        })
      } else {
        return dispatch({
          type: LOAD_STATISTICS_FAILED,
          errors: items.errors ? items.errors : items
        })
      }
    } catch (err) {
      return dispatch({
        type: LOAD_STATISTICS_FAILED,
        errors: err.message
      })
    }
  }
}
