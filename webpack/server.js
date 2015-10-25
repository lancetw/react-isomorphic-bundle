'use strict';

var path = require('path');
var env = process.env.NODE_ENV || 'development';

require('app-module-path').addPath(path.join(__dirname, '../'));
process.env.NODE_CONFIG_DIR = path.join(__dirname, '../../config');

module.exports = [
  require('config/webpack/'+ env +'.config').webpack
];
