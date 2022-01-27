import {
  CART_ADD_ITEM_START,
  CART_ADD_ITEM_SUCCESS,
  CART_ADD_ITEM_ERROR,
} from '../../action-types';

import apiClient from '../../api-client';

const addItem = (sku) => async (dispatch) => {
  dispatch({
    type: CART_ADD_ITEM_START,
  });

  try {
    const cart = await apiClient.addItem(sku);
    dispatch({
      type: CART_ADD_ITEM_SUCCESS,
      payload: cart,
    });
  } catch (err) {
    dispatch({
      type: CART_ADD_ITEM_ERROR,
    });
  }
};

export default {
  addItem,
};
