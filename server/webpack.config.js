const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExecuteShellPlugin = require('webpack-shell-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: [path.join(__dirname, 'index.js')],
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '../build/server')
  },
  target: 'node',
  node: {
    __dirname: true
  },
  externals: [nodeExternals(), 'next'],
  plugins: [
    new webpack.DefinePlugin({
      'process.server': JSON.stringify(true)
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 8
      }
    }),
    process.env.NODE_ENV === 'development' &&
      new ExecuteShellPlugin({
        onBuildEnd: ['yarn dev:server']
      })
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /app|server/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            extends: path.join(__dirname, '.babelrc')
          }
        }
      }
    ]
  }
};
