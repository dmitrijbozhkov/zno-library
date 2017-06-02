// Helper: root() is defined at the bottom
var path = require('path');
var webpack = require('webpack');

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function makeWebpackConfig() {
  var config = {};
  config.devtool = 'inline-source-map';
  config.resolve = {
    extensions: ['.ts', '.js'],
  };
  config.module = {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader?'],
        exclude: [/\.(e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      },
      {
        test: /\.ts$/,
        enforce: 'post',
        include: path.resolve('client'),
        loader: 'istanbul-instrumenter-loader',
        exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
      }
    ]
  };
  config.plugins = [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      root('./client')
    ),
    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          emitErrors: false,
          failOnHint: false
        }
      }
    })
  ];
  return config;
}();

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
