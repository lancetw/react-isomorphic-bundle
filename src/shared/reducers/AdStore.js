import {
  FETCH_AD_STARTED,
  FETCH_AD_COMPLETED,
  FETCH_AD_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  ads: {}
}

export default createReducer(initialState, {
  [FETCH_AD_STARTED]: () => (initialState),
  [FETCH_AD_COMPLETED]: (state, action) =>
    ({ ads: action.ads }),
  [FETCH_AD_FAILED]: (state, action) =>
    ({ errors: action.errors })
})
