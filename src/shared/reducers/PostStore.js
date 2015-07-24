import {
  CREATE_POST_STARTED,
  CREATE_POST_COMPLETED,
  CREATE_POST_FAILED,
  LIST_POST_STARTED,
  LIST_POST_COMPLETED,
  LIST_POST_FAILED
} from 'shared/constants/ActionTypes'

const initialState = {
  loading: true,
  errors: {},
  posts: [],
  offset: 0,
  limit: 0,
  hasMore: false,
  content: {}
}

const actionsMap = {
  [CREATE_POST_STARTED]: () => (initialState),
  [CREATE_POST_COMPLETED]: (state, action) =>
    ({ content: action.content }),
  [CREATE_POST_FAILED]: (state, action) =>
    ({ errors: action.errors }),
  [LIST_POST_STARTED]: () => (initialState),
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
    ({ loading: false, errors: action.errors })
}

export default function post (state = initialState, action) {
  const reduceFn = actionsMap[action.type]
  if (!reduceFn) return state

  return Object.assign({}, state, reduceFn(state, action))
}
