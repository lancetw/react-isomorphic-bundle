import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from 'client/admin/reducers'
import { Provider } from 'react-redux'
import routes from 'client/admin/routes'
import createBrowserHistory from 'history/lib/createBrowserHistory'

(async () => {
  /* eslint-disable react/no-multi-comp */
  const initialState = window.STATE_FROM_SERVER

  const reducer = combineReducers(reducers)
  const {
    DevTools,
    DebugPanel,
    LogMonitor
  } = require('redux-devtools/lib/react')

  const { devTools, persistState } = require('redux-devtools')

  const finalCreateStore = compose(
    applyMiddleware(
      thunk
    ),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore)

  const store = finalCreateStore(reducer, initialState)
  const history = createBrowserHistory()

  if (process.env.NODE_ENV !== 'production') {
    ReactDOM.render((
      <div>
        <Provider store={store}>
          <Router
            children={routes(store)}
            history={history}
          />
        </Provider>
        <DebugPanel top right bottom>
          <DevTools visibleOnLoad={false} store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    ), document.getElementById('admin'))
  } else {
    ReactDOM.render((
      <Provider store={store}>
        <Router
          children={routes(store)}
          history={history}
        />
      </Provider>
    ), document.getElementById('admin'))
  }
})()
