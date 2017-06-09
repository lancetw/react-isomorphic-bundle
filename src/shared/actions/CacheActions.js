import {
  CLEAR_UPLOAD_COMPLETED,
  LIST_POST_RELOADED,
  LIST_CPROP_POST_RELOADED,
  LIST_MANAGE_POST_RELOADED,
  LIST_OVERVIEW_POST_RELOADED,
  LIST_NEWS_POST_RELOADED,
  LIST_OG_POST_RELOADED,
  LIST_OG_POST_NEARBY_RELOADED,
  SEARCH_NEARBY_RELOADED,
  CLEAR_CACHE_COMPLETED
}from 'shared/constants/ActionTypes'

export function clearCache () {
  return dispatch => {
    dispatch({ type: CLEAR_UPLOAD_COMPLETED })
    dispatch({ type: LIST_POST_RELOADED })
    dispatch({ type: LIST_CPROP_POST_RELOADED })
    dispatch({ type: LIST_MANAGE_POST_RELOADED })
    dispatch({ type: LIST_OVERVIEW_POST_RELOADED })
    dispatch({ type: LIST_NEWS_POST_RELOADED })
    dispatch({ type: LIST_OG_POST_RELOADED })
    dispatch({ type: LIST_OG_POST_NEARBY_RELOADED })

    return dispatch({ type: CLEAR_CACHE_COMPLETED })
  }
}
