'use strict';
delete process.env.BROWSER;

const path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../../'));

require('babel/register');
module.exports = require('./koa.js');
