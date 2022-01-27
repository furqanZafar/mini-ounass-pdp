const csvtojson = require('csvtojson');
const fs = require('fs-promise');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Parser } = require('json2csv');

const main = async () => {
  const categories = await csvtojson().fromFile(`${__dirname}/../data/categories-full.csv`);

  const parser = new Parser({
    fields: ['categoryId', 'name'],
    quote: '',
  });

  const csv = parser.parse(categories.map(({ categoryId, name }) => ({ categoryId, name })));

  await fs.writeFile(`${__dirname}/../data/categories.csv`, csv);
};

main().catch((err) => console.error('main error', err));
