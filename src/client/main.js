import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reduxPromise from 'shared/utils/promiseMiddleware'
import * as reducers from 'shared/reducers'
import { Provider } from 'react-redux'
import routes from 'shared/routes'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import url from 'url'
import counterpart from 'counterpart'
import * as LocaleActions from 'shared/actions/LocaleActions'
import ReduxUniversalResolver from 'shared/utils/redux-universal-resolver'
import { supportedList } from 'shared/utils/locale-utils'

(async () => {
  /* eslint-disable react/no-multi-comp */
  supportedList.forEach((locale) => {
    counterpart.registerTranslations(locale, require('shared/i18n/' + locale))
  })
  counterpart.setFallbackLocale(supportedList[0])

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

    const { devTools, persistState } = require('redux-devtools')

    finalCreateStore = compose(
      applyMiddleware(
        thunk,
        reduxPromise
      ),
      devTools(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore)

    const store = finalCreateStore(reducer, initialState)
    const resolver = new ReduxUniversalResolver()
    store.resolver = resolver

    const { locale } = store.getState().locale
    counterpart.setLocale(locale || 'zh-hant-tw')

    const history = createBrowserHistory()
    const appRoot = document.getElementById('app')
    const elements = (
      <div>
        <Provider store={store}>
          <Router
            children={routes(store)}
            history={history}
            onUpdate={() => window.scrollTo(0, 0)}
          />
        </Provider>
        <DebugPanel top right bottom>
          <DevTools visibleOnLoad={false} store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    )

    render(elements, appRoot)
    resolver.clear()
  } else {
    finalCreateStore = compose(
      applyMiddleware(
        thunk,
        reduxPromise
      )
    )(createStore)

    const store = finalCreateStore(reducer, initialState)
    const resolver = new ReduxUniversalResolver()
    store.resolver = resolver

    const { locale } = store.getState().locale
    counterpart.setLocale(locale || 'zh-hant-tw')

    const history = createBrowserHistory()
    const appRoot = document.getElementById('app')
    const elements = (
      <Provider store={store}>
        <Router
          children={routes(store)}
          history={history}
          onUpdate={() => window.scrollTo(0, 0)}
        />
      </Provider>
    )
    render(elements, appRoot)
    resolver.clear()
  }
})()
