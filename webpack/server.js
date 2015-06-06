'use strict';

var path = require('path');
var env = process.env.NODE_ENV || 'development';
var debug = require('debug');

require('babel/register');
require('app-module-path').addPath(path.join(__dirname, '../'));

process.env.NODE_CONFIG_DIR = path.join(__dirname, '../../config');

var config;
if (env === 'development' || env === 'debug') {
  config = env === 'debug' ? require('config/webpack/debug.config') : require('config/webpack/development.config');

  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  var compiler = webpack(config.webpack);
  var devServer = new WebpackDevServer(compiler, config.server.options);

  devServer.listen(config.server.port, '0.0.0.0', function (err, result) {
    if (err) console.log(err);
    debug('dev')('webpack-dev-server listen on port %s', config.server.port);
  });
} else {
  module.exports = [
    require('config/webpack/production.config').webpack
  ];
}


