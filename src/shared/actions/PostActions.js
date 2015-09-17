import LOCAL_PATH from 'shared/utils/localpath'
import request from 'superagent'
import jwt from 'jsonwebtoken'
import { isArray, clone, compact, isEmpty, each } from 'lodash'
import moment from 'moment'
import {
  CREATE_POST_STARTED,
  CREATE_POST_COMPLETED,
  CREATE_POST_FAILED,
  UPDATE_POST_COMPLETED,
  UPDATE_POST_FAILED,
  REMOVE_POST_COMPLETED,
  REMOVE_POST_FAILED,
  SHOW_POST_STARTED,
  SHOW_POST_COMPLETED,
  SHOW_POST_FAILED,
  LIST_POST_RELOADED,
  LIST_POST_STARTED,
  LIST_POST_COMPLETED,
  LIST_POST_FAILED,
  LIST_NEWS_POST_RELOADED,
  LIST_NEWS_POST_STARTED,
  LIST_NEWS_POST_COMPLETED,
  LIST_NEWS_POST_FAILED,
  LIST_MANAGE_POST_RELOADED,
  LIST_MANAGE_POST_STARTED,
  LIST_MANAGE_POST_COMPLETED,
  LIST_MANAGE_POST_FAILED,
  LIST_OVERVIEW_POST_RELOADED,
  LIST_OVERVIEW_POST_STARTED,
  LIST_OVERVIEW_POST_COMPLETED,
  LIST_OVERVIEW_POST_FAILED,
  LIST_CPROP_POST_RELOADED,
  LIST_CPROP_POST_STARTED,
  LIST_CPROP_POST_COMPLETED,
  LIST_CPROP_POST_FAILED,
  COUNT_POST_IN_MONTH_STARTED,
  COUNT_POST_IN_MONTH_COMPLETED,
  COUNT_POST_IN_MONTH_FAILED,
  CLEAR_UPLOAD_COMPLETED,
  CLEAR_POST_COMPLETED
} from 'shared/constants/ActionTypes'
import { getToken } from 'shared/actions/AuthActions'
import { clearCache } from 'shared/actions/CacheActions'
import { getInfo } from 'shared/actions/UserActions'
import { setPin } from 'shared/actions/MapActions'
import { updateTitle } from 'shared/actions/LocaleActions'
import { setImageFileName } from 'shared/actions/UploadActions'
import { getFileExt } from 'shared/utils/file-utils'

async function create ({ token, value, regValue, upload, map }) {
  const _upload = compact(upload)
  return new Promise((resolve, reject) => {
    const user = jwt.decode(token)
    if (!user.id) reject('invalid token')
    const _form = clone(value)
    _form.uid = user.id
    _form.startDate = moment(_form.startDate).valueOf()
    _form.endDate = moment(_form.endDate).valueOf()
    _form.openDate = moment(regValue.openDate).valueOf()
    _form.closeDate = moment(regValue.closeDate).valueOf()
    _form.url = regValue.url
    if (map && typeof map.lat !== undefined && typeof map.lng !== undefined) {
      _form.lat = map.lat
      _form.lng = map.lng
      _form.place = map.place
    }
    _form.file = _upload
    request
      .post('/api/v1/posts')
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .send(_form)
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

async function update ({ token, id, value, regValue, upload, map }) {
  const _upload = compact(upload)
  return new Promise((resolve, reject) => {
    const user = jwt.decode(token)
    if (!user.id) reject('invalid token')
    const _form = clone(value)
    _form.uid = user.id
    _form.startDate = moment(_form.startDate).valueOf()
    _form.endDate = moment(_form.endDate).valueOf()
    _form.openDate = moment(regValue.openDate).valueOf()
    _form.closeDate = moment(regValue.closeDate).valueOf()
    _form.url = regValue.url
    if (map && typeof map.lat !== undefined && typeof map.lng !== undefined) {
      _form.lat = map.lat
      _form.lng = map.lng
      _form.place = map.place
    }
    _form.file = _upload
    request
      .put('/api/v1/posts/' + id)
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .send(_form)
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

async function destroy ({ token, id }) {
  return new Promise((resolve, reject) => {
    const user = jwt.decode(token)
    if (!user.id) reject('invalid token')
    request
      .del('/api/v1/posts/' + id)
      .set('Accept', 'application/json')
      .set('Authorization', 'JWT ' + token)
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

async function get (id) {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/posts/' + id)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}


async function list ({ offset, limit, user, type }) {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/posts')
      .query({ offset: offset })
      .query({ limit: limit })
      .query({ user: user })
      .query({ type: type })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

async function listWithCprop (cprop, offset, limit) {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/posts')
      .query({ offset: offset })
      .query({ limit: limit })
      .query({ cprop: cprop })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}


async function fetch (offset, limit, start, end, user) {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/posts')
      .query({ offset: offset })
      .query({ limit: limit })
      .query({ start: start })
      .query({ end: end })
      .query({ user: user })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

async function countPostInMonth (year, month) {
  return new Promise((resolve, reject) => {
    request
      .get(LOCAL_PATH + '/api/v1/cals')
      .query({ action: 'countPostInMonth' })
      .query({ year: year })
      .query({ month: month })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err && res.body) {
          resolve(res.body)
        } else {
          reject(err)
        }
      })
  })
}

export function init () {
  return async dispatch => {
    return dispatch({ type: CREATE_POST_STARTED })
  }
}

export function prepare () {
  return async dispatch => {
    return dispatch({ type: SHOW_POST_STARTED })
  }
}

export function submit ({ value, regValue, upload, map }) {
  return async dispatch => {
    try {
      const token = getToken()
      const content = await create({ token, value, regValue, upload, map })

      if (content.uid) {
        dispatch(clearCache())
        return dispatch({
          type: CREATE_POST_COMPLETED,
          content: content
        })
      } else {
        return dispatch({
          type: CREATE_POST_FAILED,
          errors: content.errors ? content.errors : content
        })
      }
    } catch (err) {
      return dispatch({
        type: CREATE_POST_FAILED,
        errors: err.message
      })
    }
  }
}

export function modify ({ id, value, regValue, upload, map }) {
  return async dispatch => {
    try {
      const token = getToken()
      const content = await update({ token, id, value, regValue, upload, map })

      if (content.uid) {
        dispatch(clearCache())
        return dispatch({
          type: UPDATE_POST_COMPLETED,
          content: content
        })
      } else {
        return dispatch({
          type: UPDATE_POST_FAILED,
          errors: content.errors ? content.errors : content
        })
      }
    } catch (err) {
      return dispatch({
        type: UPDATE_POST_FAILED,
        errors: err.message
      })
    }
  }
}

export function remove (id) {
  return async dispatch => {
    try {
      const token = getToken()
      const content = await destroy({ token, id })

      if (content.uid) {
        dispatch(clearCache())
        return dispatch({
          type: REMOVE_POST_COMPLETED
        })
      } else {
        return dispatch({
          type: REMOVE_POST_FAILED,
          errors: content.errors ? content.errors : content
        })
      }
    } catch (err) {
      return dispatch({
        type: REMOVE_POST_FAILED,
        errors: err.message
      })
    }
  }
}

export function show (id) {
  return async dispatch => {
    dispatch({ type: SHOW_POST_STARTED })
    try {
      const post = await get(id)
      if (typeof post !== 'undefined') {
        return dispatch({
          type: SHOW_POST_COMPLETED,
          detail: post
        })
      } else {
        return dispatch({
          type: SHOW_POST_FAILED,
          errors: post.errors ? post.errors : post
        })
      }
    } catch (err) {
      return dispatch({
        type: SHOW_POST_FAILED,
        errors: err.message
      })
    }
  }
}

export function overviewList (offset=0, limit=5, reload=false) {
  return async (dispatch, getState) => {
    /* cache service */
    const cached = getState().overview.posts
    if (!reload && offset <= 0 && !isEmpty(cached)) {
      return null
    }

    if (reload) {
      dispatch({ type: LIST_OVERVIEW_POST_RELOADED })
    }

    dispatch({ type: CLEAR_POST_COMPLETED })

    dispatch({ type: LIST_OVERVIEW_POST_STARTED })

    try {
      const posts = await list({ offset, limit })
      if (isArray(posts)) {
        return dispatch({
          type: LIST_OVERVIEW_POST_COMPLETED,
          posts: posts,
          offset: offset,
          limit: limit
        })
      } else {
        return dispatch({
          type: LIST_OVERVIEW_POST_FAILED,
          errors: posts.errors ? posts.errors : posts
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_OVERVIEW_POST_FAILED,
        errors: err.message
      })
    }
  }
}

export function newsList (offset=0, limit=5, user, reload=false) {
  return async (dispatch, getState) => {
    /* cache service */
    const cached = getState().news.posts
    if (!reload && offset <= 0 && !isEmpty(cached)) {
      return null
    }

    if (reload) {
      dispatch({ type: LIST_NEWS_POST_RELOADED })
    }

    dispatch({ type: LIST_NEWS_POST_STARTED })

    try {
      const type = 1
      const posts = await list({ offset, limit, type })
      if (isArray(posts)) {
        return dispatch({
          type: LIST_NEWS_POST_COMPLETED,
          posts: posts,
          offset: offset,
          limit: limit
        })
      } else {
        return dispatch({
          type: LIST_NEWS_POST_FAILED,
          errors: posts.errors ? posts.errors : posts
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_NEWS_POST_FAILED,
        errors: err.message
      })
    }
  }
}

export function manageList (offset=0, limit=5, user, reload=false) {
  return async (dispatch, getState) => {
    /* cache service */
    const cached = getState().manage.posts
    if (!reload && offset <= 0 && !isEmpty(cached)) {
      return null
    }

    if (reload) {
      dispatch({ type: LIST_MANAGE_POST_RELOADED })
    }

    dispatch({ type: LIST_MANAGE_POST_STARTED })

    try {
      const posts = await list({ offset, limit, user })
      if (isArray(posts)) {
        return dispatch({
          type: LIST_MANAGE_POST_COMPLETED,
          posts: posts,
          offset: offset,
          limit: limit
        })
      } else {
        return dispatch({
          type: LIST_MANAGE_POST_FAILED,
          errors: posts.errors ? posts.errors : posts
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_MANAGE_POST_FAILED,
        errors: err.message
      })
    }
  }
}

export function cpropList (cprop, offset=0, limit=5, reload=false) {
  return async (dispatch, getState) => {
    /* cache service */
    const cached = getState().cprop.posts
    if (!reload
      && offset <= 0
      && !isEmpty(cached)
      && cprop === getState().cprop.cprop) {
      return null
    }

    if (reload || cprop !== getState().cprop.cprop) {
      dispatch({ type: LIST_CPROP_POST_RELOADED })
    }

    dispatch({ type: LIST_CPROP_POST_STARTED })

    try {
      const posts = await listWithCprop(cprop, offset, limit)
      if (isArray(posts)) {
        return dispatch({
          type: LIST_CPROP_POST_COMPLETED,
          posts: posts,
          offset: offset,
          limit: limit,
          cprop: cprop
        })
      } else {
        return dispatch({
          type: LIST_CPROP_POST_FAILED,
          errors: posts.errors ? posts.errors : posts,
          cprop: cprop
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_CPROP_POST_FAILED,
        errors: err.message,
        cprop: cprop
      })
    }
  }
}

function _eq (a, b) {
  let _a = a
  let _b = b
  if (typeof _a === 'undefined') _a = null
  if (typeof _b === 'undefined') _b = null

  return (_a === _b)
}

export function fetchList (offset=0, limit=5, start, end, reload) {
  return async (dispatch, getState) => {
    /* cache service */
    const cached = getState().post.posts
    const _start = getState().post.start
    const _end = getState().post.end

    if (!reload && offset <= 0 && !isEmpty(cached)) {
      if (_eq(start, _start) && _eq(end, _end)) {
        return null
      }
    }

    if (reload) {
      dispatch({ type: LIST_POST_RELOADED })
    }

    dispatch({ type: LIST_POST_STARTED })

    try {
      const posts = await fetch(offset, limit, start, end)
      if (isArray(posts)) {
        return dispatch({
          type: LIST_POST_COMPLETED,
          posts: posts,
          offset: offset,
          limit: limit,
          start: start,
          end: end
        })
      } else {
        return dispatch({
          type: LIST_POST_FAILED,
          errors: posts.errors ? posts.errors : posts
        })
      }
    } catch (err) {
      return dispatch({
        type: LIST_POST_FAILED,
        errors: err.message
      })
    }
  }
}

export function countPostsWithCal (year, month) {
  return async (dispatch, getState) => {
    /* cache service */
    const _year = getState().post.year
    const _month = getState().post.month
    if (year === _year && month === _month) {
      return null
    }

    dispatch({ type: COUNT_POST_IN_MONTH_STARTED })

    try {
      const cals = await countPostInMonth(year, month)
      if (cals && isArray(cals.count)) {
        return dispatch({
          type: COUNT_POST_IN_MONTH_COMPLETED,
          cals: cals,
          year: year,
          month: month
        })
      } else {
        return dispatch({
          type: COUNT_POST_IN_MONTH_FAILED,
          errors: cals.errors ? cals.errors : cals
        })
      }
    } catch (err) {
      return dispatch({
        type: COUNT_POST_IN_MONTH_FAILED,
        errors: err.message
      })
    }
  }
}

export function loadOrgInfoToMap () {
  return async (dispatch, getState) => {
    await dispatch(getInfo(getState().auth.token))
    const { orginfo } = getState().user
    if (orginfo.cid) {
      const map = {
        place: orginfo.ocname,
        lat: orginfo.lat,
        lng: orginfo.lng
      }
      return dispatch(setPin(map))
    }
  }
}

export function loadPostDetail (id) {
  return async (dispatch, getState) => {
    await dispatch(show(id))
    const { detail } = getState().post
    if (detail.title) {
      dispatch(updateTitle(detail.title))
      const map = {
        place: detail.place,
        lat: detail.lat,
        lng: detail.lng
      }
      return dispatch(setPin(map))
    }
  }
}

export function loadPostEdit (id) {
  return async (dispatch, getState) => {
    await dispatch(show(id))
    const { detail } = getState().post
    if (detail.title) {
      await dispatch(updateTitle(detail.title))
      const map = {
        place: detail.place,
        lat: detail.lat,
        lng: detail.lng
      }
      await dispatch(setPin(map))

      const files = typeof detail.file !== 'undefined'
      ? JSON.parse(detail.file)
      : []

      let name
      each(files, (filename, _index) => {
        dispatch(setImageFileName(filename, _index))
      })
    }
  }
}
