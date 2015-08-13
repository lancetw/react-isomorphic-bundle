import {
  SYNC_SERVER_LOCALE_COMPLETED,
  SYNC_CLIENT_LOCALE_COMPLETED,
  UPDATE_TITLE_COMPLETED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  locale: '',
  title: ''
}

export default createReducer(initialState, {
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
})
