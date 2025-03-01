const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    buffer: require.resolve('buffer/'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify'),
    process: require.resolve('process/browser'),
    path: require.resolve('path-browserify'),
    util: require.resolve('util/'),
    os: require.resolve('os-browserify/browser'),
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': 'process/browser.js',
  };

  return config;
};
