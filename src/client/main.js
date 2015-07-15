'use strict'

import React from 'react'
import { Router } from 'react-router'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reduxPromise from 'shared/utils/promiseMiddleware'
import * as reducers from 'shared/reducers'
import { Provider } from 'react-redux'
import routes from 'shared/routes'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import runStaticMethod from 'shared/utils/runStaticMethod'
import url from 'url'
import AppContainer from 'shared/components/AppContainer'
import counterpart from 'counterpart'
import * as LocaleActions from 'shared/actions/LocaleActions'

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

  const initialState = window.STATE_FROM_SERVER   // no data
  const reducer = combineReducers(reducers)
  const finalCreateStore = applyMiddleware(
    thunk,
    reduxPromise,
  )(createStore)
  const store = finalCreateStore(reducer, initialState)

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

})()
