delete process.env.BROWSER

const env = process.env.NODE_ENV || 'development'

const path = require('path')
const modulePath = require('app-module-path')

modulePath.addPath(path.join(__dirname, '../../'))

if (env !== 'production') {
  modulePath.addPath(path.join(__dirname, '../../src'))
} else {
  modulePath.addPath(path.join(__dirname, '../../lib'))
}

modulePath.addPath(path.join(__dirname, '../../styles'))

require('babel/register')({
  'stage': 1
})

const app = require('./koa.js')

module.exports = app
