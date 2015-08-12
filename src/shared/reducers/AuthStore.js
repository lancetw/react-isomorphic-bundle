import {
  AUTH_USER_STARTED,
  AUTH_USER_COMPLETED,
  AUTH_USER_FAILED,
  SHOW_USER_COMPLETED,
  SHOW_USER_FAILED,
  REVOKE_USER_STARTED,
  REVOKE_USER_COMPLETED,
  REVOKE_USER_FAILED,
  SYNC_SERVER_USER_COMPLETED,
  SYNC_CLIENT_USER_COMPLETED,
  CHECK_TOKEN_COMPLETED,
  CHECK_TOKEN_FAILED
} from 'shared/constants/ActionTypes'

const initialState = {
  errors: {},
  token: null,
  isAuthenticated: false,
  verified: false,
  user: {}
}

const actionsMap = {
  [AUTH_USER_STARTED]: () => (initialState),
  [AUTH_USER_COMPLETED]: (state, action) =>
    ({ token: action.token, isAuthenticated: !!action.token }),
  [AUTH_USER_FAILED]: (state, action) =>
    ({ errors: action.errors, isAuthenticated: false }),
  [SHOW_USER_COMPLETED]: (state, action) =>
    ({ user: action.user }),
  [SHOW_USER_FAILED]: (state, action) =>
    ({ errors: action.errors, isAuthenticated: false, verified: false }),
  [REVOKE_USER_COMPLETED]: (state, action) =>
    ({ token: null, isAuthenticated: false, user: {} }),
  [REVOKE_USER_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [SYNC_CLIENT_USER_COMPLETED]: (state, action) =>
    ({
      token:
        typeof action.token !== 'undefined'
        ? action.token
        : state.token,
      isAuthenticated:
        typeof action.token !== 'undefined'
        ? !!action.token
        : state.isAuthenticated
    }),
  [SYNC_SERVER_USER_COMPLETED]: (state, action) =>
    ({
      token:
        typeof action.token !== 'undefined'
        ? action.token
        : state.token,
      isAuthenticated:
        typeof action.token !== 'undefined'
        ? !!action.token
        : state.isAuthenticated
    }),
  [CHECK_TOKEN_COMPLETED]: (state, action) =>
    ({ verified: true }),
  [CHECK_TOKEN_FAILED]: (state, action) =>
    ({ errors: action.errors, verified: false })
}

export default function auth (state = initialState, action) {
  // console.log('%c ' + action.type + ' ', 'background: black; color: lime')
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state

  return Object.assign({}, state, reduceFn(state, action))
}
