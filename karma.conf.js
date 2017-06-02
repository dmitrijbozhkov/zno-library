var path = require('path');

var webpackConfig = require('./webpack.karma.config');

module.exports = function (config) {
  var _config = {
    basePath: __dirname,
    frameworks: ['jasmine'],
    files: [
      { pattern: './karma-shim.js', watched: false }
    ],
    exclude: [],
    preprocessors: {
      './karma-shim.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    webpackServer: {
      noInfo: true
    },
    reporters: ["mocha", "coverage"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browserNoActivityTimeout: 30000,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    coverageReporter: {
      dir: 'coverage/',
      reporters: [{
        type: 'json',
        dir: 'coverage',
        subdir: 'json',
        file: 'coverage-final.json'
      }]
    }
  };
  config.set(_config);

};
