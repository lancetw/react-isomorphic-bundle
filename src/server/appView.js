import React from 'react'
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

      const history = createMemoryHistory()
      const location = history.createLocation(this.url)
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

      const lang = originLocaleName(this.getLocaleFromHeader())
      store.dispatch(LocaleActions.sync(lang || 'zh-hant-tw'))
      translator.setLocale(lang || 'zh-hant-tw')

      let appString
      let assets
      let head
      let siteUrl
      let ogImage
      const { error, redirectLocation, renderProps }
      = yield new Promise((resolve) => {
        match({routes: routes(store), location},
          (_error, _redirectLocation, _renderProps) => {
            resolve({
              error: _error,
              _redirectLocation: _redirectLocation,
              renderProps: _renderProps
            })
          })
      })

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
        <AppContainer translator={translator} host={this.host}>
          {() =>
            <Provider store={store}>
              {() =>
                <RoutingContext {...renderProps} />
              }
            </Provider>
          }
        </AppContainer>
      )

      React.renderToString(elements)  // need this line to collect data
      yield resolver.dispatch()
      appString = React.renderToString(elements)

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

      const serverState = React.renderToString(
        <script
          dangerouslySetInnerHTML=
            {{
              __html:
                `window.STATE_FROM_SERVER=${JSON.stringify(store.getState())};`
            }} />
      )

      siteUrl = this.href
      ogImage = '//' + this.host + '/images/icon.png'
      this.body = nunjucks.render('index.html', {
        appString,
        assets,
        siteUrl,
        ogImage,
        meta: head.meta,
        env: process.env,
        title: head.title,
        stateFromServer: serverState
      })

      resolver.clear()
    }
  })
}
