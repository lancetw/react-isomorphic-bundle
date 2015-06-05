'use strict';
delete process.env.BROWSER;

var path = require('path');
require('app-module-path').addPath(path.join(__dirname, '../../'));

require('babel/register');
require('./koa.js');
