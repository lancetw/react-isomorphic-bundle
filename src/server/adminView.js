import nunjucks from 'nunjucks'
import route from 'koa-route'
import fs from 'fs'
import path from 'path'

nunjucks.configure('views', {
  autoescape: true
})

function *reactRoute () {
  const env = process.env.NODE_ENV
  let assets
  if (env === 'development') {
    assets = fs.readFileSync(
      path.resolve(__dirname, '../../storage/webpack-admin-stats.json')
    )
    assets = JSON.parse(assets)
  } else {
    assets = require('storage/webpack-admin-stats.json')
  }
  this.body = nunjucks.render('admin.html', {
    env: process.env,
    assets
  })
}

export default function (app) {
  app.use(route.get('/ring', reactRoute))
  app.use(route.get('/ring/(.*)', reactRoute))
}
