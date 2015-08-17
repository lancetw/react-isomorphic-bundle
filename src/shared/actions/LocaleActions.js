import request from 'superagent'
import {
  SYNC_CLIENT_LOCALE_COMPLETED,
  SYNC_SERVER_LOCALE_COMPLETED,
  UPDATE_TITLE_COMPLETED
} from 'shared/constants/ActionTypes'
import { fixLocaleName } from 'shared/utils/locale-utils'

export function sync (locale) {
  return async dispatch => {
    if (process.env.BROWSER) {
      setLocale(locale)
      return dispatch({
        type: SYNC_CLIENT_LOCALE_COMPLETED,
        locale: getLocale()
      })
    } else {
      send(locale)
      setLocale(locale)
      return dispatch({
        type: SYNC_SERVER_LOCALE_COMPLETED,
        locale: locale
      })
    }
  }
}

export function updateTitle (title) {
  return async dispatch => {
    return dispatch({
      type: UPDATE_TITLE_COMPLETED,
      title: title
    })
  }
}

export function setLocale (locale) {
  if (typeof localStorage !== 'undefined'
      && localStorage !== null)
    if (locale && locale !== 'undefined')
      localStorage.setItem('locale', locale)
}

export function getLocale () {
  let locale = ''
  if (typeof localStorage !== 'undefined'
      && localStorage !== null)
    locale = localStorage.getItem('locale')

  return locale
}

export async function send (locale) {
  return new Promise((resolve, reject) => {
    request
      .post('/auth/locale')
      .set('Accept', 'application/json')
      .send({ locale: locale })
      .end(function (err, res) {
        if (!err && res.body)
          resolve(res.body)
        else
          reject(err)
      })
  })
}
