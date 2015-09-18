import React from 'react'
import { Router } from 'react-router'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reduxPromise from 'shared/utils/promiseMiddleware'
import * as reducers from 'client/admin/reducers'
import { Provider } from 'react-redux'
import routes from 'client/admin/routes'
import BrowserHistory from 'react-router/lib/BrowserHistory'

(async () => {
  let finalCreateStore

  const reducer = combineReducers(reducers)

  const {
    DevTools,
    DebugPanel,
    LogMonitor
  } = require('redux-devtools/lib/react')

  const { devTools, persistState } = require('redux-devtools')

  finalCreateStore = compose(
    applyMiddleware(
      thunk,
      reduxPromise
    ),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore)

  const store = finalCreateStore(reducer)

  const history = new BrowserHistory()

  if (process.env.NODE_ENV !== 'production') {
    React.render((
      <div>
        <Provider store={store}>
          {() =>
            <Router
              children={routes(store)}
              history={history}
            />
          }
        </Provider>
        <DebugPanel top right bottom>
          <DevTools visibleOnLoad={false} store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    ), document.getElementById('app'))
  } else {
    React.render((
      <Provider store={store}>
        {() =>
          <Router
            children={routes(store)}
            history={history}
          />
        }
      </Provider>
    ), document.getElementById('app'))
  }
})()
