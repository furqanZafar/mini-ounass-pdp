const jsesc = require('jsesc');

// -- react, redux --
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { Helmet } = require('react-helmet');
const { createStore } = require('redux');
const { Provider } = require('react-redux');

const rootReducer = require('../frontend/root-reducer');
// eslint-disable-next-line import/extensions
const pdpPageComponent = require('../frontend/pages/pdp/pdp.jsx').default;

module.exports = async (req, res) => {
  const rps = Math.max((req.query.rpm || 60), 60) / 60;

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const initialState = require((req.query.variants || 'none') === 'none'
    ? '../data/pdp-no-variant.json'
    : '../data/pdp-multi-variant.json');

  const t0 = Date.now();
  const store = createStore(rootReducer, initialState);

  const app = React.createElement(
    Provider,
    { store },
    React.createElement(pdpPageComponent, null),
  );

  let html;
  for (let i = 0; i < rps; i += 1) {
    html = ReactDOMServer.renderToString(app);
  }
  const t1 = Date.now();

  let initialStateStr;
  for (let i = 0; i < rps; i += 1) {
    initialStateStr = JSON.stringify(initialState);
  }
  const t2 = Date.now();

  // this works for us (since arabic is the only other language we support right now)
  for (let i = 0; i < rps; i += 1) {
    initialStateStr = JSON.stringify(initialState)
      .replace(/[\u007F-\uFFFF]/g, (chr) => `\\u${(`0000${chr.charCodeAt(0).toString(16)}`).substr(-4)}`);
  }
  const t3 = Date.now();

  for (let i = 0; i < rps; i += 1) {
    initialStateStr = jsesc(initialState);
  }
  const t4 = Date.now();

  // this gets the head elements from the last rendered Helmet element,
  // so it must be called immediately after renderToString as per docs
  const helmet = Helmet.renderStatic();

  res.render('index.ejs', {
    browser: '',
    component: 'pdp/pdp',
    isIOSSafari: false,
    iOSAppStoreID: '',
    language: 'en',
    prefetchUrls: [],
    preloadFonts: [],
    urlPath: '',
    versionHash: '',
    stats: {
      renderToString: t1 - t0,
      stringify: t2 - t1,
      stringifyPlusReplace: t3 - t2,
      jsesc: t4 - t3,
    },

    initialStateStr,
    helmet,
    html,
  });
};
