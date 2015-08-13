'use strict'

import React from 'react'
import { Router } from 'react-router'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reduxPromise from 'shared/utils/promiseMiddleware'
import * as reducers from 'shared/reducers'
import { Provider } from 'react-redux'
import routes from 'shared/routes'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import url from 'url'
import AppContainer from 'shared/components/AppContainer'
import counterpart from 'counterpart'
import * as LocaleActions from 'shared/actions/LocaleActions'
import ReduxUniversalResolver from 'shared/utils/redux-universal-resolver'

(async () => {
  require('react-a11y')(React)

  const lang = LocaleActions.getLocale()
  counterpart.registerTranslations(
    'en',
    require('shared/i18n/en')
  )
  counterpart.registerTranslations(
    'zh-hant-tw',
    require('shared/i18n/zh-hant-tw')
  )
  counterpart.setLocale(lang || 'zh-hant-tw')

  const initialState = window.STATE_FROM_SERVER
  const reducer = combineReducers(reducers)

  let finalCreateStore
  if (process.env.NODE_ENV !== 'production') {
    const debug = require('debug')
    debug.enable('dev,koa')

    const {
      DevTools,
      DebugPanel,
      LogMonitor
    } = require('redux-devtools/lib/react')

    const DiffMonitor = require('redux-devtools-diff-monitor')
    const { devTools, persistState } = require('redux-devtools')

    finalCreateStore = compose(
      applyMiddleware(
        thunk,
        reduxPromise
      ),
      devTools(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
      createStore
    )

    const store = finalCreateStore(reducer, initialState)
    const resolver = new ReduxUniversalResolver()
    store.resolver = resolver

    const history = new BrowserHistory()
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
        <DevTools store={store} monitor={DiffMonitor} />
      </div>
    ), document.getElementById('app'))

    resolver.clear()

  } else {
    finalCreateStore = compose(
      applyMiddleware(
        thunk,
        reduxPromise
      ),
      createStore
    )

    const store = finalCreateStore(reducer, initialState)
    const resolver = new ReduxUniversalResolver()
    store.resolver = resolver
    const history = new BrowserHistory()
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

    resolver.clear()
  }

})()
