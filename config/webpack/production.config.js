'use strict';

import webpack from 'webpack';
import path from 'path';
import {isArray} from 'lodash';
import autoprefixer from 'autoprefixer-core';
import csswring from 'csswring';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import bemLinter from 'postcss-bem-linter';
import postReporter from 'postcss-reporter';
import postImport from 'postcss-import';
import postInclude from 'postcss-include';
import postColorFn from 'postcss-color-function';
import postPrecss from 'precss';

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
      chunkFilename: '[name]-[hash].js',
      publicPath: PUBLIC_PATH,
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }),
      new ExtractTextPlugin('[name].css'),
      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          NODE_ENV: JSON.stringify('production')
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
          exclude: /(node_modules|styles)/,
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
          loader: 'babel?optional[]=runtime&stage=0',
          exclude: (/node_modules|styles/)
        },
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap&importLoaders=1!postcss') },
        { test: /\.less$/,
          loader: ExtractTextPlugin.extract('style', 'css!postcss!less?noIeCompat')}
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

