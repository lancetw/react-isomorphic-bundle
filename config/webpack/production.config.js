'use strict';

import webpack from 'webpack';
import path from 'path';
import {isArray} from 'lodash';
import autoprefixer from 'autoprefixer-core';
import csswring from 'csswring';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const writeStats = require('webpack/utils/write-stats');
const PROTOCOL = 'http';
const PORT = process.env.PORT || 3010;
const PUBLIC_PATH = `/assets/`;

require('webpack/utils/clean-dist')();

export default {
  server: {
    port: PORT,
    options: {
      publicPath: PUBLIC_PATH,
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
    devtool: 'source-map',
    entry: {
      app: [
        './src/client/index'
      ]
    },
    output: {
      path: path.join(__dirname, '../../public/assets/'),
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: PUBLIC_PATH,
    },
    plugins: [
      new ExtractTextPlugin('[name]-[chunkhash].css'),
      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          NODE_ENV: JSON.stringify('production'),
          BASE_URL: JSON.stringify(process.env.BASE_URL)
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          sequences: true,
          dead_code: true,
          drop_debugger: true,
          comparisons: true,
          conditionals: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: true,
          hoist_funs: true,
          if_return: true,
          join_vars: true,
          cascade: true,
          drop_console: true
        },
        output: {
          comments: false
        }
      }),
      function () {
        this.plugin('done', writeStats);
      }
    ],
    module: {
      preLoaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'eslint'
        }
      ],
      loaders: [
        { test: /\.json$/, loaders: ['json'] },
        {
          test: /\.(woff2?|eot|ttf)$/,
          loader: 'url?limit=10000&name=[sha512:hash:base64:7].[ext]'
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          loader: 'url?limit=10000&name=[sha512:hash:base64:7].[ext]!image?optimizationLevel=7&progressive&interlaced'
        },
        {
          test: /\.jsx?$/,
          loader: 'babel',
          exclude: /node_modules/
        },
        { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!less?noIeCompat') }
      ]
    },
    postcss: {
        defaults: [autoprefixer, csswring],
        cleaner:  [autoprefixer({ browsers: [] })]
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.json', '.less', '.css'],
      modulesDirectories: ['node_modules', 'src', 'styles']
    }
  }
};

