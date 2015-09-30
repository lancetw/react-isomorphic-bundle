import {
  UPLOAD_FILE_STARTED,
  UPLOAD_FILE_COMPLETED,
  UPLOAD_FILE_FAILED,
  UPLOAD_FILE_PROGRESS,
  SET_IMAGE_PREVIEW_COMPLETED,
  SET_IMAGE_FILENAME_COMPLETED,
  CLEAR_UPLOAD_COMPLETED,
  SET_UPLOAD_ERROR_MESSAGE_COMPLETED,
  CLEAR_UPLOAD_ERROR_MESSAGE_COMPLETED
} from 'shared/constants/ActionTypes'
import { createReducer } from 'shared/utils/redux-utils'

const initialState = {
  images: [],
  filenames: [],
  index: 0,
  response: null,
  percentages: [],
  errorMessages: []
}

export default createReducer(initialState, {
  [UPLOAD_FILE_STARTED]: () => (initialState),
  [UPLOAD_FILE_COMPLETED]: (state, action) =>
    ({ response: action.response }),
  [UPLOAD_FILE_FAILED]: (state, action) => {
    const _percentages = initialState.percentages
    _percentages[action.index] = action.percentage
    const _errorMessages = state.errorMessages
    _errorMessages[action.index] = action.errors
    return {
      errorMessages: _errorMessages,
      index: action.index
    }
  },
  [UPLOAD_FILE_PROGRESS]: (state, action) => {
    const _percentages = initialState.percentages
    _percentages[action.index] = action.percentage
    return {
      percentages: _percentages,
      index: action.index
    }
  },
  [SET_IMAGE_PREVIEW_COMPLETED]: (state, action) => {
    const _images = initialState.images
    _images[action.index] = action.src
    return {
      images: _images,
      index: action.index
    }
  },
  [SET_IMAGE_FILENAME_COMPLETED]: (state, action) => {
    const _filenames = initialState.filenames
    _filenames[action.index] = action.filename
    return {
      filenames: _filenames,
      index: action.index
    }
  },
  [CLEAR_UPLOAD_COMPLETED]: (state) => {
    state.images.length = 0
    state.filenames.length = 0
    state.percentages.length = 0
    return state
  },
  [SET_UPLOAD_ERROR_MESSAGE_COMPLETED]: (state, action) => {
    const _errorMessages = state.errorMessages
    _errorMessages[action.errorId] = action.errorMessage
    return {
      errorMessages: _errorMessages
    }
  },
  [CLEAR_UPLOAD_ERROR_MESSAGE_COMPLETED]: (state) => {
    state.errorMessages.length = 0
    return state
  }
})
