import {
  SET_MAP_PIN_STARTED,
  SET_MAP_PIN_COMPLETED,
  SET_MAP_PIN_FAILED,
  SET_MAP_GEO_STARTED,
  SET_MAP_GEO_COMPLETED,
  SET_MAP_GEO_FAILED,
  FIND_MAP_PLACE_STARTED,
  FIND_MAP_PLACE_COMPLETED,
  FIND_MAP_PLACE_FAILED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  lat: null,
  lng: null,
  lat_: null,
  lng_: null,
  place: null,
  center: [ null, null ],
  errors: null,
  loading: true
}

export default createReducer(initialState, {
  [SET_MAP_PIN_STARTED]: () => (initialState),
  [SET_MAP_PIN_COMPLETED]: (state, action) => {
    if (action.lat === null || action.lng === null)
      return initialState
    else
      return {
        lat: action.lat,
        lng: action.lng,
        place: action.place,
        center: [ action.lat, action.lng ],
        loading: false
      }
  },
  [SET_MAP_PIN_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [SET_MAP_GEO_COMPLETED]: (state, action) =>
    ({
      lat_: action.lat_,
      lng_: action.lng_
    }),
  [SET_MAP_GEO_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [FIND_MAP_PLACE_COMPLETED]: (state, action) =>
    ({
      lat: action.lat,
      lng: action.lng,
      place: action.place,
      center: [ action.lat, action.lng ]
    }),
  [FIND_MAP_PLACE_FAILED]: (state, action) =>
    ({ errors: action.errors })
})
