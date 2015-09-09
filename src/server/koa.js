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
import router from './routes'
import path from 'path'
import co from 'co'
import favicon from 'koa-favicon'
import services from 'src/server/services'
import models from 'src/server/db/models'
import locale from 'koa-locale'

const debug = require('debug')
const leveldb = level('./storage/leveldb')

const app = koa()
const env = process.env.NODE_ENV || 'development'

locale(app, 'lang')

// ES7 async
// app.experimental = true

app.use(responseTime())
app.use(logger())
app.use(helmet())

if (env === 'production') {
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

const cacheOpts: Object = { maxAge: 86400000, gzip: true }

if (env === 'development') {
  const webpackConfig: Object = require('config/webpack/development.config')
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

app.use(favicon(path.join(__dirname, '../../images/favicon.ico')))

app.keys = require('config').app.SESSION_KEYS
app.use(
  session(
    { store: store({ db: leveldb }) }
  )
)

app.use(facebookAuth.initialize())
app.use(router.routes())

app.use(mount('/api/v1', cors()))
app.use(mount('/api/v1', services.v1))
app.use(mount('/api/v1', basicAuth.initialize()))
app.use(mount('/api/v1', jwtAuth.initialize()))

import appView from './appView'
appView(app)

const port = process.env.PORT || 3000
co(function *() {
  const connection = yield models.sequelize.sync()
  if (connection) {
    app.listen(port)
    debug('*')(`App started listening on port ${port}`)
  }
})

export default app
