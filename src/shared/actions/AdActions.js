import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwt from 'jsonwebtoken'
import { isArray, isEmpty } from 'lodash'
import moment from 'moment'
import {
  FETCH_AD_STARTED,
  FETCH_AD_COMPLETED,
  FETCH_AD_FAILED
} from 'shared/constants/ActionTypes'

async function getPair () {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/promotions')
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

export function fetchSet () {
  return async dispatch => {
    dispatch({ type: FETCH_AD_STARTED })
    try {
      const res = await getPair()

      if (isArray(res)) {
        return dispatch({
          type: FETCH_AD_COMPLETED,
          ads: res
        })
      } else {
        return dispatch({
          type: FETCH_AD_FAILED,
          errors: res.errors ? res.errors : res
        })
      }
    } catch (err) {
      return dispatch({
        type: FETCH_AD_FAILED,
        errors: err.message
      })
    }
  }
}
