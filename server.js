const http = require('http');
const express = require('express');
const morgan = require('morgan');
const url = require('url');
const argv = require('minimist-argv');
const proxy = require('proxy-middleware');
const webpack = require('webpack');
const webpackDev = require('webpack-dev-middleware');
const webpackHot = require('webpack-hot-middleware');
const webpackConfig = require('./webpack/common.config');
const mocks = require('./mocks');
const config = require('./config')[argv.env];

const compiler = webpack(webpackConfig);
const app = express();

app.use(webpackDev(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));
app.use(webpackHot(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
}));
app.use(morgan('short'));
app.use(express.static(`${__dirname}/`));
// if API is ready, proxy to api server. else use mock data.
app.use(mocks());
app.use('/apis', proxy(url.parse(`http://${config.apiHost}:${config.apiPort}/apis`)));
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

http.createServer(app).listen(config.port || 7070, () => {
  console.log('🎈 --> Server started: http://localhost:%d', config.port);
  console.log('🎈 --> API Proxy Server started: %s:%d', config.apiHost, config.apiPort);
});
