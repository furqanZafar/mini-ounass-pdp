const {
  CART_ADD_ITEM_SUCCESS,
} = require('../../action-types');

module.exports = (state = {}, action = {}) => {
  switch (action.type) {
    case CART_ADD_ITEM_SUCCESS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
