import {
  SYNC_SERVER_LOCALE_COMPLETED,
  SYNC_CLIENT_LOCALE_COMPLETED,
  UPDATE_TITLE_COMPLETED
} from 'shared/constants/ActionTypes'

const initialState = {
  locale: '',
  title: ''
}

const actionsMap = {
  [SYNC_CLIENT_LOCALE_COMPLETED]: (state, action) =>
    ({
      token:
        typeof action.locale !== 'undefined'
        ? action.locale
        : state.locale
    }),
  [SYNC_SERVER_LOCALE_COMPLETED]: (state, action) =>
    ({
      token:
        typeof action.locale !== 'undefined'
        ? action.locale
        : state.locale
    }),
  [UPDATE_TITLE_COMPLETED]: (state, action) =>
    ({ title: action.title })
}

export default function locale (state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state

  return Object.assign({}, state, reduceFn(state, action))
}
