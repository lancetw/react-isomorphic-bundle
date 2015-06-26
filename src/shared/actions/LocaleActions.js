import {
  SYNC_CLIENT_LOCALE_COMPLETED,
  SYNC_SERVER_LOCALE_COMPLETED
} from 'shared/constants/ActionTypes'

export function sync (locale) {
  console.log(locale)
  setLocale(locale)
  return async dispatch => {
    if (typeof document !== 'undefined')
      return dispatch({
        type: SYNC_CLIENT_LOCALE_COMPLETED,
        locale: getLocale()
      })
    else
      return dispatch({
        type: SYNC_SERVER_LOCALE_COMPLETED,
        locale: locale
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
