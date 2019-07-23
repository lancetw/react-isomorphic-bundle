import koa from 'koa'
import mount from 'koa-mount'
import helmet from 'koa-helmet'
import logger from 'koa-logger'
import responseTime from 'koa-response-time'
import session from 'koa-generic-session'
import level from 'levelup'
import store from 'koa-level'
import staticCache from 'koa-static-cache'
import cors from 'koa-cors'
import basicAuth from './passport/basic'
import jwtAuth from './passport/local-jwt'
import facebookAuth from './passport/facebook'
import googleAuth from './passport/google'
import localAuth from './passport/local'
import router from './routes'
import path from 'path'
import co from 'co'
import favicon from 'koa-favicon'
import services from 'src/server/services'
import adminServices from 'src/server/services/admin'
import models from 'src/server/db/models'
import locale from 'koa-locale'
import bodyParser from 'koa-bodyparser'
import noCache from 'koa-no-cache'

const debug = require('debug')
const leveldb = level('./storage/leveldb')

const app = koa()
// ES7 async
// app.experimental = true

const env = process.env.NODE_ENV || 'development'

co(function *() {
  if (env === 'development') {
    const webpack = require('webpack')
    const config = require('config/webpack/'+ env +'.config')
    const compiler = webpack(config.webpack)
    app.use(require('koa-webpack-dev-middleware')(compiler, config.server.options))
    app.use(require('koa-webpack-hot-middleware')(compiler))
  }
})

locale(app, 'lang')
app.use(responseTime())
app.use(logger())
app.use(helmet())

if (env === 'production') {
  app.set('trust proxy', 1)
  sess.cookie.secure = true 
  
  app.use(require('koa-conditional-get')())
  app.use(require('koa-etag')())
  app.use(require('koa-compressor')())

  // Cache pages
  const cache = require('lru-cache')({ maxAge: 3000 })
  app.use(require('koa-cash')({
    get: function* (key) {
      return cache.get(key)
    },
    set: function* (key, value) {
      cache.set(key, value)
    }
  }))
}

if (env === 'development') {
  debug.enable('dev,koa')
  require('blocked')((ms) => debug('koa')(`blocked for ${ms}ms`))
}

const cacheOpts = { maxAge: 86400000, gzip: true }

if (env === 'development') {
  app.use(
    mount(
      '/assets',
      require('koa-proxy')({ host: 'http://0.0.0.0:3000' })
    )
  )
} else {
  app.use(
    mount('/assets',
      staticCache(
        path.join(__dirname, '../../public/assets'),
        cacheOpts
      )
    )
  )
}

app.use(mount('/images',
  staticCache(
    path.join(__dirname, '../../images'),
    cacheOpts
  )
))

app.use(mount('/uploads',
  staticCache(
    path.join(__dirname, '../../uploads'),
    cacheOpts
  )
))

app.use(favicon(path.join(__dirname, '../../images/app/v2.3-t/favicon.ico')))

app.keys = require('config').app.SESSION_KEYS
app.use(
  session(
    { cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      overwrite: true,
      signed: true,
      secure: true,
      sameSite: 'strict'
    }, store: store({ db: leveldb }) }
  )
)

app.use(noCache({
  paths: ['/api/v1/(.*)'],
  types: ['application/json']
}))

app.use(mount('/api/v1', cors()))
app.use(mount('/api/v1', services.v1))
app.use(mount('/api/v1', basicAuth.initialize()))
app.use(mount('/api/v1', jwtAuth.initialize()))

app.use(bodyParser())
app.use(localAuth.initialize())
app.use(facebookAuth.initialize())
app.use(googleAuth.initialize())
app.use(router.routes())

app.use(mount('/api/admin/v1', adminServices.v1))

import adminView from './adminView'
adminView(app)

import appView from './appView'
appView(app)

const port = process.env.PORT || 3000

co(function *() {
  const connection = yield models.sequelize.sync()
  if (connection) {
    app.listen(port)
    debug('koa')(`App started listening on port ${port}`)
  }
})

module.exports = app
