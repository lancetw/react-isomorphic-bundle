'use strict';

import webpack from 'webpack';
import path from 'path';
import {isArray} from 'lodash';
import autoprefixer from 'autoprefixer';
import csswring from 'csswring';
import bemLinter from 'postcss-bem-linter';
import postReporter from 'postcss-reporter';
import postImport from 'postcss-import';
import postInclude from 'postcss-include';
import postColorFn from 'postcss-color-function';
import postPrecss from 'precss';

const writeStats = require('webpack/utils/write-stats');
const writeAdminStats = require('webpack/utils/write-admin-stats');
const LOCAL_IP = require('dev-ip')();
const PROTOCOL = 'http';
const HOST = isArray(LOCAL_IP) && LOCAL_IP[0] || LOCAL_IP || 'localhost';
const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = `${PROTOCOL}://${HOST}:${PORT}/assets/`;

module.exports = {
  server: {
    port: PORT,
    options: {
      publicPath: PUBLIC_PATH,
      hot: true,
      historyApiFallback: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
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
        `webpack-hot-middleware/client?path=/__webpack_hmr&timeout=60000`,
        './src/client/index',
        './src/client/fallback'
      ],
      admin: [
        `webpack-hot-middleware/client?path=/__webpack_hmr&timeout=60000`,
        './src/client/admin',
        './src/client/fallback'
      ]
    },
    output: {
      path: path.join(__dirname, '../../public/assets/'),
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[hash].js',
      publicPath: PUBLIC_PATH
    },
    plugins: [
      new webpack.PrefetchPlugin('react/addons'),
      new webpack.PrefetchPlugin('react'),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/, /webpack-stats\.json$/),
      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          NODE_ENV: JSON.stringify('development')
        }
      }),
      function () {
        this.plugin('done', writeStats);
        this.plugin('done', writeAdminStats);
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
          loader: 'babel',
          query: {
            cacheDirectory: true,
            plugins: [
              'react-transform',
              'transform-runtime',
              'transform-decorators-legacy'
            ],
            presets: ['react', 'es2015', 'stage-0'],
            extra: {
              'react-transform': {
                'transforms': [{
                  'transform': 'react-transform-hmr',
                  'imports': ['react'],
                  'locals': ['module']
                }]
              }
            }
          },
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

