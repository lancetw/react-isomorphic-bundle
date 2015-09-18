import nunjucks from 'nunjucks'
import route from 'koa-route'
import fs from 'fs'
import path from 'path'

nunjucks.configure('views', {
  autoescape: true
})

export default function (app) {
  app.use(route.get('/supervisor', function *() {
    const env = process.env.NODE_ENV
    let assets
    if (env === 'development') {
      assets = fs.readFileSync(
        path.resolve(__dirname, '../../storage/webpack-stats.json')
      )
      assets = JSON.parse(assets)
    } else {
      assets = require('storage/webpack-stats.json')
    }
    this.body = nunjucks.render('admin.html', {
      env: process.env,
      hash: assets.hash,
      publicPath: assets.publicPath
    })
  }))
}
