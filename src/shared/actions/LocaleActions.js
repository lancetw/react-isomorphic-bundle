import request from 'superagent'
import {
  SYNC_CLIENT_LOCALE_COMPLETED,
  SYNC_SERVER_LOCALE_COMPLETED,
  UPDATE_TITLE_COMPLETED
} from 'shared/constants/ActionTypes'
import { originLocaleName, fallBackLocale } from 'shared/utils/locale-utils'
import { isEmpty } from 'lodash'

export function setLocale (locale) {
  if (!localStorage) {
    throw Error('no localStorage')
  } else {
    if (!locale) {
      throw Error('localStorage data is falsy')
    } else {
      localStorage.setItem('locale', fallBackLocale(locale))
    }
  }
}

export function getLocale () {
  let locale = ''
  if (!localStorage) {
    throw Error('no localStorage')
  } else {
    locale = localStorage.getItem('locale')
  }
  return fallBackLocale(locale)
}

export async function send (locale) {
  return new Promise((resolve, reject) => {
    request
      .post('/auth/locale')
      .set('Accept', 'application/json')
      .send({ locale: locale })
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

export function sync (locale) {
  return async dispatch => {
    if (process.env.BROWSER) {
      await send(locale)
      setLocale(locale)
      return dispatch({
        type: SYNC_CLIENT_LOCALE_COMPLETED,
        locale: fallBackLocale(getLocale())
      })
    } else {
      return dispatch({
        type: SYNC_SERVER_LOCALE_COMPLETED,
        locale: fallBackLocale(locale)
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
