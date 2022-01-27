const babelCore = require('@babel/core');
const compression = require('compression');
const express = require('express');

const config = require('./config');

// convert jsx to js during SSR
require.extensions['.jsx'] = (module, filename) => {
  const jsCode = babelCore.transformFileSync(filename, { ast: false }).code;
  module._compile(jsCode, filename); // eslint-disable-line no-underscore-dangle
};

// skip less files during SSR
require.extensions['.less'] = (module, filename) => {
  module._compile('module.exports = {}', filename); // eslint-disable-line no-underscore-dangle
};

const app = express();

app.use(compression());

app.set('views', `${__dirname}/frontend/views`);
app.set('view engine', 'ejs');
// eslint-disable-next-line no-underscore-dangle
app.engine('.html', require('ejs').__express);

const { NODE_ENV } = process.env;

if (NODE_ENV === 'dev') {
  /* eslint-disable  import/no-extraneous-dependencies, global-require */
  const watcher = require('chokidar').watch([
    '**/*.js*',
    '**/*.less',
    '**/*.yml',
  ], {
    ignored: ['**/node_modules/**/*', '**/.git/**/*'],
    interval: 1000,
  });

  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('clearing require module cache');

      Object.keys(require.cache)
        .filter((id) => !id.includes('/node_modules/'))
        .forEach((id) => delete require.cache[id]);
    });
  });

  const webpackConfig = require('./webpack.config');
  const compiler = require('webpack')(webpackConfig);

  app.set('view cache', false);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    logLevel: 'trace',
  }));

  app.use(require('webpack-hot-middleware')(compiler));
  /* eslint-disable  import/no-extraneous-dependencies, global-require */
}

if (NODE_ENV === 'dev') {
  // by requiring the router inside the request handler we can avoid restarting the node server
  // whenever a middleware is updated
  // eslint-disable-next-line global-require
  app.use('/', (req, res, next) => require('./router')(req, res, next));
} else {
  // eslint-disable-next-line global-require
  app.use('/', require('./router'));
}

const { port } = config;
app.listen(port, (err) => {
  if (err) {
    console.log('Unable to listen on port', port, err);
    return;
  }
  console.log('Listening on port', port);
});
