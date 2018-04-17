const webpack = require('webpack');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  distDir: 'build/.next',
  webpack: (config, { isServer }) => {
    config.context = __dirname;
    if (isServer) {
      config.node = {
        __dirname: false
      };
    }
    config.plugins.unshift(
      ...[!isServer && new webpack.IgnorePlugin(/i18next-node/)].filter(Boolean)
    );
    return config;
  }
};
