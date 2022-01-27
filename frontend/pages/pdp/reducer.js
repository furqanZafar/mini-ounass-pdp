const {
  CART_ADD_ITEM_START,
  CART_ADD_ITEM_SUCCESS,
  CART_ADD_ITEM_ERROR,
} = require('../../action-types');

module.exports = (state = {}, action = {}) => {
  switch (action.type) {
    case CART_ADD_ITEM_START: {
      return {
        ...state,
        addingItem: true,
      };
    }

    case CART_ADD_ITEM_SUCCESS:
    case CART_ADD_ITEM_ERROR: {
      return {
        ...state,
        addingItem: false,
      };
    }

    default: {
      return state;
    }
  }
};
