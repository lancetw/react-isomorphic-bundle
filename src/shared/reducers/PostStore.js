import {
  CREATE_POST_STARTED,
  CREATE_POST_COMPLETED,
  CREATE_POST_FAILED,
  SHOW_POST_STARTED,
  SHOW_POST_COMPLETED,
  SHOW_POST_FAILED,
  LIST_POST_STARTED,
  LIST_POST_COMPLETED,
  LIST_POST_FAILED,
  COUNT_POST_IN_MONTH_STARTED,
  COUNT_POST_IN_MONTH_COMPLETED,
  COUNT_POST_IN_MONTH_FAILED
} from 'shared/constants/ActionTypes'

const initialState = {
  loading: true,
  errors: {},
  posts: [],
  offset: 0,
  limit: 0,
  hasMore: false,
  content: {},
  count: [],
  countStart: [],
  detail: {}
}

const actionsMap = {
  [CREATE_POST_STARTED]: () => (initialState),
  [CREATE_POST_COMPLETED]: (state, action) =>
    ({ content: action.content }),
  [CREATE_POST_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [SHOW_POST_STARTED]: () => ({
    errors: {},
    detail: {}
  }),
  [SHOW_POST_COMPLETED]: (state, action) =>
    ({ errors: {}, detail: action.detail }),
  [SHOW_POST_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [LIST_POST_STARTED]: () => ({
    errors: {},
    posts: [],
    hasMore: false
  }),
  [LIST_POST_COMPLETED]: (state, action) => {
    let hasMore = false
    if (action.posts.length > 0)
      hasMore = true
    const posts = state.posts.concat(action.posts)
    return {
      errors: {},
      content: {},
      loading: false,
      posts: posts,
      offset: action.offset,
      limit: action.limit,
      hasMore: hasMore
    }
  },
  [LIST_POST_FAILED]: (state, action) =>
    ({ loading: false, errors: action.errors }),
  [COUNT_POST_IN_MONTH_STARTED]: () => ({ count: [], countStart: [] }),
  [COUNT_POST_IN_MONTH_COMPLETED]: (state, action) =>
    ({ count: action.cals.count, countStart: action.cals.countStart }),
  [COUNT_POST_IN_MONTH_FAILED]: (state, action) =>
    ({ errors: action.errors })
}

export default function post (state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state

  return Object.assign({}, state, reduceFn(state, action))
}
