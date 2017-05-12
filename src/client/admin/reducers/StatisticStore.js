import {
  LOAD_STATISTICS_STARTED,
  LOAD_STATISTICS_COMPLETED,
  LOAD_STATISTICS_FAILED
} from 'client/admin/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'
import moment from 'moment'

const initialState = {
  done: false,
  year: moment().year(),
  month: moment().month() + 1,
  items: [],
  count: null,
  data: [],
  errors: null
}

export default createReducer(initialState, {
  [LOAD_STATISTICS_STARTED]: () =>
    ({ done: false }),
  [LOAD_STATISTICS_COMPLETED]: (state, action) =>
    ({ done: true, year: action.year, month: action.month, count: action.count, items: action.items, data: action.data, errors: null }),
  [LOAD_STATISTICS_FAILED]: (state, action) =>
    ({ done: false, errors: action.errors })
})
