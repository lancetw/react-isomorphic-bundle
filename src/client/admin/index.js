import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reduxPromise from 'shared/utils/promiseMiddleware'
import * as reducers from 'client/admin/reducers'
import { Provider } from 'react-redux'
import routes from 'client/admin/routes'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { persistState } from 'redux-devtools'
import DevTools from 'client/DevTools'

(async () => {
  /* eslint-disable react/no-multi-comp */
  let initialState = window.STATE_FROM_SERVER

  let reducer = combineReducers(reducers)
  let enhancer = compose(
    applyMiddleware(
      thunk,
      reduxPromise
    ),
    DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore)

  let store = enhancer(reducer, initialState)
  let history = createBrowserHistory()

  if (process.env.NODE_ENV !== 'production') {
    render((
      <Provider store={store}>
        <div>
          <Router
            children={routes(store)}
            history={history}
          />
          <DevTools />
        </div>
      </Provider>
    ), document.getElementById('admin'))
  } else {
    render((
      <Provider store={store}>
        <Router
          children={routes(store)}
          history={history}
        />
      </Provider>
    ), document.getElementById('admin'))
  }
})()
