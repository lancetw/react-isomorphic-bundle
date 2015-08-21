import {
  EVENT_SCROLL_POSITION_RELOADED,
  EVENT_SCROLL_POSITION_STARTED,
  EVENT_SCROLL_POSITION_COMPLETED,
  EVENT_SCROLL_POSITION_FAILED
} from 'shared/constants/ActionTypes'

export function saveScrollPosition (scrollTop, store, reload=false) {
  return async (dispatch, getState) => {
    /* cache service */
    const _scrollTop = getState().event.scrollTop
    if (!reload && scrollTop > 0 && _scrollTop === scrollTop) {
      return null
    }

    if (reload) {
      dispatch({ type: EVENT_SCROLL_POSITION_RELOADED })
    }

    dispatch({ type: EVENT_SCROLL_POSITION_STARTED })

    if (scrollTop >= 0) {
      return dispatch({
        type: EVENT_SCROLL_POSITION_COMPLETED,
        scrollTop: scrollTop,
        store: store
      })
    } else {
      return dispatch({
        type: EVENT_SCROLL_POSITION_FAILED,
        errors: { message: 'scrollTop Error'}
      })
    }
  }
}
