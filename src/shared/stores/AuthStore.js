import debug from 'debug'
import {
  AUTH_USER_STARTED,
  AUTH_USER_COMPLETED,
  AUTH_USER_FAILED,
  REVOKE_USER_STARTED,
  REVOKE_USER_COMPLETED,
  REVOKE_USER_FAILED
} from 'shared/constants/ActionTypes'

const initialState = {
  errors: {},
  token: null,
  isAuthenticated: false
}

const actionsMap = {
  [AUTH_USER_STARTED]: () => (initialState),
  [AUTH_USER_COMPLETED]: (state, action) =>
    ({ token: action.token, isAuthenticated: !!action.token }),
  [AUTH_USER_FAILED]: (state, action) =>
    ({ errors: action.errors, isAuthenticated: false }),
  [REVOKE_USER_COMPLETED]: (state, action) =>
    ({ token: null, isAuthenticated: false }),
  [REVOKE_USER_FAILED]: (state, action) =>
    ({ errors: action.errors })
}

export default function auth (state = initialState, action) {
  debug('dev')('%c ' + action.type + ' ', 'background: black; color: lime')
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state

  return Object.assign({}, state, reduceFn(state, action))
}
