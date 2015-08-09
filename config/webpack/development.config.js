'use strict';

import webpack from 'webpack';
import path from 'path';
import {isArray} from 'lodash';
import autoprefixer from 'autoprefixer-core';
import csswring from 'csswring';
import bemLinter from 'postcss-bem-linter';
import postReporter from 'postcss-reporter';
import postImport from 'postcss-import';
import postInclude from 'postcss-include';
import postColorFn from 'postcss-color-function';
import postPrecss from 'precss';

const writeStats = require('webpack/utils/write-stats');
const LOCAL_IP = require('dev-ip')();
const PROTOCOL = 'http';
const HOST = isArray(LOCAL_IP) && LOCAL_IP[0] || LOCAL_IP || 'localhost';
const PORT = process.env.PORT + 1 || 3001;
const PUBLIC_PATH = `${PROTOCOL}://${HOST}:${PORT}/assets/`;

export default {
  server: {
    port: PORT,
    options: {
      publicPath: PUBLIC_PATH,
      historyApiFallback: true,
      hot: true,
      stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false
      }
    }
  },
  webpack: {
    devtool: 'eval-source-map',
    entry: {
      app: [
        `webpack-dev-server/client?http://${HOST}:${PORT}`,
        'webpack/hot/only-dev-server',
        './src/client/index',
        './src/client/fallback'
      ]
    },
    publicPath: PUBLIC_PATH,
    output: {
      path: path.join(__dirname, '../../public'),
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[hash].js',
      publicPath: PUBLIC_PATH
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          NODE_ENV: JSON.stringify('development')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      function () {
        this.plugin('done', writeStats);
      }
    ],
    module: {
      preLoaders: [
        {
          test: /\.js$|.jsx$/,
          exclude: /(node_modules|styles)/,
          loader: 'eslint'
        }
      ],
      loaders: [
        { test: /\.json$/, loaders: ['json'] },
        {
          test: /\.(jpe?g|png|gif|svg|woff2?|eot|ttf)$/,
          loader: 'url?limit=10000&name=[sha512:hash:base64:7].[ext]'
        },
        {
          test: /\.jsx?$/,
          loader: 'react-hot!babel?optional[]=runtime&stage=0',
          exclude: (/node_modules|styles/)
        },
        { test: /\.css$/, loader: 'style!css?sourceMap&importLoaders=1!postcss' },
        { test: /\.less$/, loader: 'style!css?sourceMap&importLoaders=1!postcss!less?noIeCompat' }
      ]
    },
    postcss: {
        defaults: [postImport, postInclude, autoprefixer, csswring, bemLinter, postReporter, postPrecss, postColorFn],
        cleaner:  [autoprefixer({ browsers: [] })]
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.json', '.css', '.less'],
      modulesDirectories: ['node_modules', 'src', 'styles']
    }
  }
};

