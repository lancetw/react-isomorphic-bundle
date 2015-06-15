'use strict';

import webpack from 'webpack';
import path from 'path';
import {isArray} from 'lodash';
import autoprefixer from 'autoprefixer-core';
import csswring from 'csswring';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import bemLinter from 'postcss-bem-linter';
import logWarnings from 'postcss-log-warnings';
import nested from 'postcss-nested';
import simpleVars from 'postcss-simple-vars';
import atImport from 'postcss-import';
import atInclude from 'postcss-include';

const writeStats = require('webpack/utils/write-stats');
const PUBLIC_PATH = `/assets/`;

require('webpack/utils/clean-dist')();

export default {
  webpack: {
    devtool: 'cheap-module-source-map',
    entry: {
      app: [
        './src/client/index'
      ],
      fallback: [
        './src/client/fallback'
      ]
    },
    output: {
      path: path.join(__dirname, '../../public/assets/'),
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: PUBLIC_PATH,
    },
    plugins: [
      new ExtractTextPlugin('[name].css'),
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
          loader: 'babel?optional[]=runtime&stage=1',
          exclude: /node_modules/
        },
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap&importLoaders=1!postcss') },
        { test: /\.less$/,
          loader: ExtractTextPlugin.extract('style', 'css!postcss!less?noIeCompat')}
      ]
    },
    postcss: {
        defaults: [atImport, atInclude, autoprefixer, csswring, bemLinter, logWarnings, nested, simpleVars],
        cleaner:  [autoprefixer({ browsers: [] })]
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.json', '.css', '.less'],
      modulesDirectories: ['node_modules', 'src', 'styles']
    }
  }
};

