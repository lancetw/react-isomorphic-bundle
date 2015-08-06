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

const initialState = {
  lat: 25.018536,
  lng: 121.529146,
  lat_: 25.018536,
  lng_: 121.529146,
  place: null,
  center: [ 25.018536, 121.529146 ],
  errors: null
}

const actionsMap = {
  [SET_MAP_PIN_STARTED]: () => (initialState),
  [SET_MAP_PIN_COMPLETED]: (state, action) => {
    if (action.lat === null || action.lng === null)
      return initialState
    else
      return {
        lat: action.lat,
        lng: action.lng,
        place: action.place,
        center: [ action.lat, action.lng ]
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
}

export default function map (state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state

  return Object.assign({}, state, reduceFn(state, action))
}
