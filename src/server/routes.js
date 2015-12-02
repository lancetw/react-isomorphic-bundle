import jwtHelper, { verifyJwt } from './jwt-helper'
import passport from 'koa-passport'
import validate from 'parameter'
import db from 'src/server/db'
import * as AuthActions from 'shared/actions/AuthActions'
import Feed from 'feed'
import hashids from 'src/shared/utils/hashids-plus'
import { nl2br } from 'src/shared/utils/common-utils'
import { TranslatorInit } from './translator-helper'
import { isArray } from 'lodash'
import moment from 'moment'
import { twbAuth, twbBindUser } from './twbAuth'

const router = require('koa-router')()
const User = db.users

router
  .post('/auth/login', function *(next) {
    const user = this.request.body
    const rule = {
      password: 'password',
      email: 'email'
    }
    const errors = validate(rule, user)
    if (errors) {
      this.redirect('/login')
    }

    try {
      const profile = yield User.auth(user.email, user.password)

      if (!profile) {
        throw new Error('no user')
      }

      // response JSON web token
      const token = jwtHelper(profile)

      // set session token
      const sess = this.session
      sess.token = token

      this.redirect('/sync/token')
    } catch (err) {
      this.redirect('/login')
    }
  })

router
  .get('/auth/logout', function *(next) {
    this.session.token = null
    this.logout()
    this.redirect('/')
  })

router
  .post('/auth/register', function *(next) {
    const user = this.request.body

    const rule = {
      email: 'email',
      password: { type: 'password', compare: 'passwordCheck', min: 6 },
      tos: 'string'
    }

    const errors = validate(rule, user)
    if (errors) {
      this.redirect('/signup')
    } else {
      try {
        const profile = yield User.create(user)

        if (!profile) {
          throw new Error('no user')
        }

        // response JSON web token
        const token = jwtHelper(profile)

        // set session token
        const sess = this.session
        sess.token = token

        this.redirect('/sync/token?token=' + token)
      } catch (err) {
        this.redirect('/signup')
      }
    }
  })

router
  .post('/api/v1/login', function *(next) {
    const ctx = this
    yield passport.authenticate('basic', {
      session: false
    }, function *(err, profile) {
      if (!err && profile) {
        // response JSON web token
        const token = jwtHelper(profile)

        // set session token
        const sess = ctx.session
        sess.token = token

        ctx.body = { token: token }
      } else {
        ctx.status = 200
        ctx.body = { profile }
      }
    })
  })

router
  .post('/api/admin/v1/login', function *(next) {
    const ctx = this
    yield passport.authenticate('local', function *(err, profile) {
      if (!err && profile) {
        // response JSON web token
        const checkAdmin = true
        const token = jwtHelper(profile, checkAdmin)

        // set session token
        const sess = ctx.session
        sess.token = token

        ctx.body = { token: token }
      } else {
        ctx.status = 200
        ctx.body = { profile }
      }
    })
  })

router
  .get('/api/v1/logout', function *(next) {
    this.session.token = null
    this.logout()
    this.body = { revoke: true }
  })

router
  .post('/api/v1/twblogin', function *(next) {
    const body = this.request.body

    const rule = {
      password: 'password',
      email: 'email'
    }
    const errors = validate(rule, body)
    if (errors) {
      this.status = 200
      this.body = errors
    } else {
      let profile
      let err

      try {
        const res = yield twbAuth(body)
        if (res.email) {
          profile = yield twbBindUser(res)
        }
      } catch (error) {
        err = error
      }

      if (!err && profile.email) {
        // response JSON web token
        const token = jwtHelper(profile)

        // set session token
        const sess = this.session
        sess.token = token

        this.body = { token: token }
      } else {
        this.status = 200
        this.body = { errors: err }
      }
    }
  })

router
  .post('/auth/locale', function *(next) {
    const body = this.request.body
    this.session.locale = body.locale
    this.body = { locale: body.locale }
  })

router
  .get('/auth/facebook', function *(next) {
    // [TODO]: get param to set nextPage

    yield passport.authenticate('facebook', { scope: ['email'] })
  })

router
  .get('/auth/facebook/request/email', function *(next) {
    yield passport.authenticate(
      'facebook',
      {
        authType: 'rerequest',
        scope: ['email']
      }
    )
  })

router
  .get('/auth/facebook/callback', function *(next) {
    const ctx = this
    yield passport.authenticate('facebook', {
      failureRedirect: '/login'
    }, function*(err, profile, failed) {
      if (!err && profile) {
        const token = jwtHelper(profile)

        // set session token
        const sess = ctx.session
        sess.token = token

        // [TODO]: get param to set nextPage
        ctx.redirect('/sync/token?token=' + token)
      } else {
        if (failed) {
          ctx.redirect('/login')
        } else {
          if (err.message === 'user blocked') {
            ctx.redirect('/login')
          } else if (err.message === 'no emails') {
            ctx.redirect('/auth/facebook/request/email')
          } else {
            ctx.redirect('/')
          }
        }
      }
    })
  })

router
  .get('/auth/google', function *(next) {
    // [TODO]: get param to set nextPage

    yield passport.authenticate('google', {
      scope: ['email']
    })
  })

router
  .get('/auth/google/request/email', function *(next) {
    yield passport.authenticate(
      'google',
      {
        prompt: 'consent',
        scope: ['email']
      }
    )
  })

router
  .get('/auth/google/callback', function *(next) {
    const ctx = this
    yield passport.authenticate('google', {
      failureRedirect: '/login'
    }, function*(err, profile, failed) {
      if (!err && profile) {
        const token = jwtHelper(profile)

        // set session token
        const sess = ctx.session
        sess.token = token

        // [TODO]: get param to set nextPage
        ctx.redirect('/sync/token?token=' + token)
      } else {
        if (failed) {
          ctx.redirect('/login')
        } else {
          if (err.message === 'user blocked') {
            ctx.redirect('/login')
          } else if (err.message === 'no emails') {
            ctx.redirect('/auth/google/request/email')
          } else {
            ctx.redirect('/')
          }
        }
      }
    })
  })

router
  .post('/auth/token/verify', function *(next) {
    const body = this.request.body
    const rule = {
      token: 'string'
    }
    const errors = validate(rule, body)

    if (errors) {
      this.status = 400
      this.set('WWW-Authenticate',
        'JWT realm="users", error="invalid_token", error_description="'
        + JSON.stringify(errors) + '"')
      this.body = errors
    }

    try {
      const verified = yield verifyJwt(body.token)
      if (verified) {
        this.body = { response: true }
      } else {
        this.body = { response: false }
      }
    } catch (err) {
      this.status = 401
      this.set('WWW-Authenticate',
        'JWT realm="users",error="invalid_token",error_description="'
        + JSON.stringify(err) + '"')
      this.body = err
    }
  })

router
  .get('/rss', function *(next) {
    const { translator } = TranslatorInit(this.getLocaleFromHeader())

    const feed = new Feed({
      title: translator.translate('title.site'),
      link: `${this.protocol}://${this.host}`,
      image: `${this.protocol}://${this.host}/images/icon.png`
    })

    const Post = db.posts
    const limit = 12
    const descriptionLength = 20
    const items = yield Post.list(0, limit, 'rss')
    items.forEach((post) => {
      feed.addItem({
        title: post.title,
        link: `${this.protocol}://${this.host}/w/${hashids.encode(post.id)}`,
        description: post.content.substr(0, descriptionLength),
        date: post.created_at,
        author: [{
          name: post.ocname,
          link: post.url
        }],
        content: nl2br(post.content)
      })
    })

    this.type = 'application/atom+xml; charset=utf-8'
    this.body = feed.render('atom-1.0')
  })

module.exports = router
