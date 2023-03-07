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
import { persistState } from 'redux-devtools'
import DevTools from 'client/DevTools'
import ReactGA from 'react-ga4'

function logPageView () {
  ReactGA.set({
    page: window.location.pathname
  })
}

(async () => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('G-QFRLL1YQ2V')
  }
  /* eslint-disable react/no-multi-comp */
  supportedList.forEach((locale) => {
    counterpart.registerTranslations(locale, require('shared/i18n/' + locale))
  })
  counterpart.setFallbackLocale(supportedList[0])

  let initialState = window.STATE_FROM_SERVER
  let reducer = combineReducers(reducers)
  let enhancer
  if (process.env.NODE_ENV !== 'production') {
    const debug = require('debug')
    debug.enable('dev,koa')

    enhancer = compose(
      applyMiddleware(
        thunk,
        reduxPromise
      ),
      DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore)

    const store = enhancer(reducer, initialState)
    const resolver = new ReduxUniversalResolver()
    store.resolver = resolver

    const { locale } = store.getState().locale
    counterpart.setLocale(locale || 'zh-hant-tw')

    const history = createBrowserHistory()
    const appRoot = document.getElementById('app')
    const elements = (
      <Provider store={store}>
        <div>
          <Router
            children={routes(store)}
            history={history}
            onUpdate={() => {
              window.scrollTo(0, 0)
            }}
          />
          <DevTools />
        </div>
      </Provider>
    )

    render(elements, appRoot)
    resolver.clear()
  } else {
    enhancer = compose(
      applyMiddleware(
        thunk,
        reduxPromise
      )
    )(createStore)

    const store = enhancer(reducer, initialState)
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
          onUpdate={() => {
            window.scrollTo(0, 0)
            logPageView()
          }}
        />
      </Provider>
    )
    render(elements, appRoot)
    resolver.clear()
  }
})()
