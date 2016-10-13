const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ReplacePlugin = require('replace-webpack-plugin');
const LessPluginCleanCSS = require('less-plugin-clean-css');

const publicPath = '/console/';
const extractLESS = new ExtractTextPlugin('app-[hash].css');

module.exports = {

  output: {
    publicPath: publicPath,
    filename: 'app-[hash].js',
  },

  module: {
    loaders: [{
      test: /\.less$/i,
      loader: extractLESS.extract(['css', 'less']),
    }],
  },

  lessLoader: {
    lessPlugins: [
      new LessPluginCleanCSS({ advanced: false }),
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
      __DEVELOPMENT__: false,
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'framework-[hash].js',
      minChunks: (module) => (
        module.resource &&
        module.resource.indexOf('node_modules') !== -1 &&
        module.resource.indexOf('.css') === -1
      ),
    }),
    extractLESS,
    new ReplacePlugin({
      skip: process.env.NODE_ENV === 'development',
      entry: 'index.html',
      hash: '[hash]',
      output: 'dist/index.html',
      data: {
        css: `<link type="text/css" rel="stylesheet" href="${publicPath}app-[hash].css">`,
        js: `<script src="${publicPath}framework-[hash].js"></script><script src="${publicPath}app-[hash].js"></script>`,
        bughd: '<script type="text/javascript" src="https://dn-bughd-web.qbox.me/bughd.min.js" crossOrigin="anonymous"></script><script type="text/javascript">window.bughd = window.bughd || function() {}; window.bughd(\'create\',{key: \'bad6cc566e49c4b2549ebbd011a2dd4c\',});</script>',
      },
    }),
    new webpack.ProvidePlugin({
      Promise: 'exports?global.Promise!es6-promise',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
};
