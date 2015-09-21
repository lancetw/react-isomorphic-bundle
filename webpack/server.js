'use strict';

var path = require('path');
var env = process.env.NODE_ENV || 'development';

require('babel/register');
require('app-module-path').addPath(path.join(__dirname, '../'));

process.env.NODE_CONFIG_DIR = path.join(__dirname, '../../config');

var config;
if (env !== 'production' && env !== 'test') {
  config = require('config/webpack/'+ env +'.config');
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  var compiler = webpack(config.webpack);
  var devServer = new WebpackDevServer(compiler, config.server.options);

  devServer.listen(config.server.port, '0.0.0.0', function (err, result) {
    if (err) console.log(err);
    console.log('webpack-dev-server listen on port %s', config.server.port);
  });
} else {
  module.exports = [
    require('config/webpack/'+ env +'.config').webpack
  ];
}


