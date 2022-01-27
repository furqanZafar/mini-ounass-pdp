const nconf = require('nconf');
const yaml = require('js-yaml');

const { NODE_ENV } = process.env;

const format = {
  parse: yaml.load,
  stringify: yaml.safeDump,
};

const nconfProvider = new nconf.Provider();

nconfProvider.env('__');
nconfProvider.file('deploy-env', {
  file: `${__dirname}/${NODE_ENV}.yml`,
  format,
});

module.exports = nconfProvider.get();
