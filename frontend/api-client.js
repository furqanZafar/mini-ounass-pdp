const axios = require('axios');
const jsCookie = require('js-cookie');
const qs = require('qs');

const apiClient = axios.create({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  headers: {
    'x-platform': 'web',
  },
});

apiClient.interceptors.request.use((requestConfig) => {
  const { env, country } = window.initialState.global;

  // eslint-disable-next-line no-param-reassign
  requestConfig.headers['x-oun-csrf-token'] = jsCookie.get(`${env}__.${country}.csrf`);

  return requestConfig;
});

const addItem = async (sku) => {
  const { data } = await apiClient.post('/cart/addItem', { sku });
  return data;
};

module.exports = {
  addItem,
};
