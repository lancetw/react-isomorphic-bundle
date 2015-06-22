'use strict'

import React from 'react'
import { Router } from 'react-router'
import Location from 'react-router/lib/Location'
import { createRedux, createDispatcher } from 'redux'
import * as stores from 'shared/stores'
import { Provider } from 'redux/react'
import routes from 'shared/routes'
import fs from 'fs'
import path from 'path'
import nunjucks from 'nunjucks'
import debug from 'debug'
import { connect } from 'redux/react'
import DocumentTitle from 'shared/components/addon/document-title'
import * as AuthActions from 'shared/actions/AuthActions'
import url from 'url'
import runStaticMethod from 'shared/utils/runStaticMethod'

nunjucks.configure('views', {
  autoescape: true
})

export default function (app) {

  app.use(function *() {
    const isCashed = this.cashed ? yield *this.cashed() : false
    if (!isCashed) {

      const redux = createRedux(stores)
      const location = new Location(this.path, this.query)

      // save session token to store
      this.session.token && redux.dispatch(AuthActions.save(this.session.token))

      let appString, assets, title

      try {
        const { error, initialState, transition, handler } =
          yield new Promise((resolve) => {
          Router.run(routes(redux), location, (_error, _initialState, _transition) => {

            resolve({
              error: _error,
              initialState: _initialState,
              transition: _transition
            })
          })
        })

        if (!initialState) {
          if (transition.isCancelled) {
            return this.redirect(url.format(transition.redirectInfo))
          }
        }

        try {
          yield runStaticMethod(
            initialState.components,
            'routerWillRun',
            { dispatch: redux.dispatch }
          )
        } catch (error) {}

        appString = React.renderToString(
          <Provider redux={redux}>
            {() =>
              <Router {...initialState} />
            }
          </Provider>
        )

        title = DocumentTitle.rewind()

        const env = process.env.NODE_ENV
        if (env === 'development') {
          assets = fs.readFileSync(
            path.resolve(__dirname, '../../storage/webpack-stats.json')
          )
          assets = JSON.parse(assets)
        }
        else
          assets = require('storage/webpack-stats.json')

      } catch (error) {
        if (error.redirect)
          return this.redirect(error.redirect)

        throw error
      }

      this.body = nunjucks.render('index.html', {
        appString,
        assets,
        env: process.env,
        title
      })

    }
  })
}
