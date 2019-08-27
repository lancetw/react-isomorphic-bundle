import React from 'react'
import { renderToString } from 'react-dom/server'
import { Router, RoutingContext, match } from 'react-router'
import { createMemoryHistory } from 'history'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reduxPromise from 'shared/utils/promiseMiddleware'
import * as reducers from 'shared/reducers'
import { Provider } from 'react-redux'
import routes from 'shared/routes'
import fs from 'fs'
import path from 'path'
import nunjucks from 'nunjucks'
import Helmet from 'react-helmet'
import * as AuthActions from 'shared/actions/AuthActions'
import * as LocaleActions from 'shared/actions/LocaleActions'
import url from 'url'
import AppContainer from 'shared/components/AppContainer'
import route from 'koa-route'
import ReduxUniversalResolver from 'shared/utils/redux-universal-resolver'
import { TranslatorInit } from './translator-helper'

nunjucks.configure('views', {
  autoescape: true,
})

// thunkify stat
function stat(file) {
  return function(done) {
    fs.stat(file, done)
  }
}

export default function(app) {
  app.use(
    route.get('/sitemap.xml', function*(ctx, next) {
      try {
        const location = './sitemap.xml'
        const fstat = yield stat(location)
        if (fstat.isFile()) {
          this.type = path.extname(location)
          this.body = fs.createReadStream(location)
        }
      } catch (err) {
        this.status = 404
        this.body = '404'
      }
    })
  )

  app.use(
    route.get('/robots.txt', function*(ctx, next) {
      try {
        const location = './robots.txt'
        const fstat = yield stat(location)
        if (fstat.isFile()) {
          this.type = path.extname(location)
          this.body = fs.createReadStream(location)
        }
      } catch (err) {
        this.status = 404
        this.body = '404'
      }
    })
  )

  app.use(
    route.get('/uploads/*', function*(ctx, next) {
      let location = path.join(__dirname, '../../', decodeURI(this.path))
      try {
        const fstat = yield stat(location)
        if (fstat.isFile()) {
          this.type = path.extname(location)
          this.body = fs.createReadStream(location)
        }
      } catch (err) {
        this.status = 404
        this.body = '404'
      }
    })
  )

  app.use(function*() {
    let isCashed = this.cashed ? yield* this.cashed() : false
    if (!isCashed) {
      const reducer = combineReducers(reducers)
      const enhancer = applyMiddleware(thunk, reduxPromise)(createStore)
      const store = enhancer(reducer)
      const resolver = new ReduxUniversalResolver()
      store.resolver = resolver
      store.protocol = this.protocol
      store.host = this.host
      store.query = this.query

      const history = createMemoryHistory()
      const location = history.createLocation(this.url)

      // save session token to store
      if (this.session.token && this.session.token !== null) {
        store.dispatch(AuthActions.sync(this.session.token))
      }

      const { translator, lang } = TranslatorInit(this.getLocaleFromHeader())
      store.dispatch(LocaleActions.sync(lang || 'zh-hant-tw'))

      let appString
      let assets
      let head
      let siteUrl
      let pageUrl
      const { error, redirectLocation, renderProps } = yield new Promise(
        resolve => {
          match(
            { routes: routes(store), location },
            (_error, _redirectLocation, _renderProps) => {
              resolve({
                error: _error,
                redirectLocation: _redirectLocation,
                renderProps: _renderProps,
              })
            }
          )
        }
      )

      if (redirectLocation) {
        this.redirect(redirectLocation.pathname + redirectLocation.search)
        return
      } else if (error) {
        this.redirect('/')
        return
      } else if (renderProps === null) {
        this.redirect('/')
        return
      }

      const elements = (
        <AppContainer translator={translator}>
          {() => (
            <Provider store={store}>
              <RoutingContext {...renderProps} />
            </Provider>
          )}
        </AppContainer>
      )

      renderToString(elements) // need this line to collect data
      yield resolver.dispatch(store)
      appString = renderToString(elements)
      head = Helmet.rewind()

      const env = process.env.NODE_ENV
      if (env === 'development') {
        assets = fs.readFileSync(
          path.resolve(__dirname, '../../storage/webpack-stats.json')
        )
        assets = JSON.parse(assets)
      } else {
        assets = require('storage/webpack-stats.json')
      }

      const serverState = renderToString(
        <script
          dangerouslySetInnerHTML={{
            __html: `window.STATE_FROM_SERVER=${JSON.stringify(
              store.getState()
            )};`,
          }}
        />
      )

      siteUrl = 'https://' + this.host
      pageUrl = this.href.replace(/^http/, 'https')
      pageUrl = location.pathname === '/sync/token' ? siteUrl : pageUrl

      this.body = nunjucks.render('index.html', {
        appString,
        assets,
        siteUrl,
        pageUrl,
        head,
        env: process.env,
        stateFromServer: serverState,
      })

      resolver.clear()
    }
  })
}
