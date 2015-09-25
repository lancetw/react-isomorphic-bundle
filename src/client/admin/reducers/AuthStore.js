import {
  AUTH_USER_STARTED,
  AUTH_USER_COMPLETED,
  AUTH_USER_FAILED,
  SHOW_USER_COMPLETED,
  SHOW_USER_FAILED,
  REVOKE_USER_COMPLETED,
  REVOKE_USER_FAILED,
  SYNC_CLIENT_USER_COMPLETED,
  CHECK_TOKEN_COMPLETED,
  CHECK_TOKEN_FAILED
} from 'client/admin/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  errors: {},
  token: null,
  isAuthenticated: false,
  verified: false,
  user: {},
  isFetching: false
}

export default createReducer(initialState, {
  [AUTH_USER_STARTED]: () =>
    ({ isFetching: true }),
  [AUTH_USER_COMPLETED]: (state, action) =>
    ({ token: action.token, isAuthenticated: !!action.token, isFetching: false }),
  [AUTH_USER_FAILED]: (state, action) =>
    ({ errors: action.errors, isAuthenticated: false, isFetching: false }),
  [SHOW_USER_COMPLETED]: (state, action) =>
    ({ user: action.user }),
  [SHOW_USER_FAILED]: (state, action) =>
    ({ errors: action.errors, isAuthenticated: false, verified: false }),
  [REVOKE_USER_COMPLETED]: () =>
    ({ token: null, isAuthenticated: false, verified: false, user: {} }),
  [REVOKE_USER_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [SYNC_CLIENT_USER_COMPLETED]: (state, action) =>
    ({
      isFetching: false,
      errors: {},
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
    ({ verified: action.verified }),
  [CHECK_TOKEN_FAILED]: (state, action) =>
    ({ errors: action.errors, verified: false })
})

