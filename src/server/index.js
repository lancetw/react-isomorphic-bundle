'use strict';
delete process.env.BROWSER;

const env = process.env.NODE_ENV || 'development';

const path = require('path');

require('app-module-path').addPath(path.join(__dirname, '../../'));
if (env !== 'production') {
  require('app-module-path').addPath(path.join(__dirname, '../../src'));
}
else {
  require('app-module-path').addPath(path.join(__dirname, '../../lib'));
}

require('babel/register')({
  "stage": 1
});

const app = require('./koa.js');

module.exports = app;
