const { combineReducers } = require('redux');

const cart = require('./pages/cart/reducer');
const pdp = require('./pages/pdp/reducer');

module.exports = combineReducers({
  cart,
  pdp,
});
