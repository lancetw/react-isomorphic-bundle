import React from 'react'
import { Router } from 'react-router'
import Location from 'react-router/lib/Location'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reduxPromise from 'shared/utils/promiseMiddleware'
import * as reducers from 'shared/reducers'
import { Provider } from 'react-redux'
import routes from 'shared/routes'
import fs from 'fs'
import path from 'path'
import nunjucks from 'nunjucks'
import DocumentTitle from 'shared/components/addon/document-title'
import * as AuthActions from 'shared/actions/AuthActions'
import * as LocaleActions from 'shared/actions/LocaleActions'
import url from 'url'
import AppContainer from 'shared/components/AppContainer'
import route from 'koa-route'
import ReduxUniversalResolver from 'shared/utils/redux-universal-resolver'
import { originLocaleName } from 'shared/utils/locale-utils'

const Translator = require('counterpart').Instance

nunjucks.configure('views', {
  autoescape: true
})

// thunkify stat
function stat (file) {
  return function (done) {
    fs.stat(file, done)
  }
}

export default function (app) {
  app.use(route.get('/uploads/*', function *() {
    const location = path.join(__dirname, '../../', decodeURI(this.path))
    const fstat = yield stat(location)

    if (fstat.isFile()) {
      this.type = path.extname(location)
      this.body = fs.createReadStream(location)
    }
  }))

  app.use(function *() {
    const isCashed = this.cashed ? yield *this.cashed() : false
    if (!isCashed) {
      const reducer = combineReducers(reducers)
      const finalCreateStore = applyMiddleware(
        thunk,
        reduxPromise
      )(createStore)
      const store = finalCreateStore(reducer)
      const resolver = new ReduxUniversalResolver()
      store.resolver = resolver

      const location = new Location(this.path, this.query)
      // save session token to store
      if (this.session.token && this.session.token !== null) {
        store.dispatch(AuthActions.sync(this.session.token))
      }
      /* eslint-disable max-len */
      const translator = new Translator()
      translator.registerTranslations('en', require('shared/i18n/en'))
      translator.registerTranslations('zh-hant-tw', require('shared/i18n/zh-hant-tw'))
      translator.registerTranslations('zh-hant-cn', require('shared/i18n/zh-hant-cn'))
      translator.setFallbackLocale('zh-hant-tw')

      let lang
      const { locale } = this.session
      if (locale) {
        lang = locale
      } else {
        lang = originLocaleName(this.getLocaleFromHeader())
      }
      store.dispatch(LocaleActions.sync(lang || 'zh-hant-tw'))
      translator.setLocale(lang || 'zh-hant-tw')

      let appString
      let assets
      let title
      try {
        const { error, initialState, transition, handler }
        = yield new Promise((resolve) => {
          Router.run(
          routes(store),
          location,
          (_error, _initialState, _transition) => {
            resolve({
              error: _error,
              initialState: _initialState,
              transition: _transition
            })
          })
        })

        if (!initialState && transition.isCancelled) {
          return this.redirect(url.format(transition.redirectInfo))
        }

        const elements = (
          <AppContainer translator={translator}>
            {() =>
              <Provider store={store}>
                {() =>
                  <Router {...initialState} />
                }
              </Provider>
            }
          </AppContainer>
        )

        React.renderToString(elements)  // need this line to collect data
        yield resolver.dispatch()
        appString = React.renderToString(elements)

        title = DocumentTitle.rewind()

        const env = process.env.NODE_ENV
        if (env === 'development') {
          assets = fs.readFileSync(
            path.resolve(__dirname, '../../storage/webpack-stats.json')
          )
          assets = JSON.parse(assets)
        } else {
          assets = require('storage/webpack-stats.json')
        }
      } catch (error) {
        if (error.redirect) {
          return this.redirect(error.redirect)
        }

        throw error
      }

      const serverState = React.renderToString(
        <script
          dangerouslySetInnerHTML=
            {{
              __html:
                `window.STATE_FROM_SERVER=${JSON.stringify(store.getState())};`
            }} />
      )

      this.body = nunjucks.render('index.html', {
        appString,
        assets,
        env: process.env,
        title,
        stateFromServer: serverState
      })

      resolver.clear()
    }
  })
}
