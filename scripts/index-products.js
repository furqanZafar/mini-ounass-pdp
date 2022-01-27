const _ = require('lodash');
const { Client } = require('elasticsearch');
const fs = require('fs');

const main = async () => {
  const elasticsearchClient = new Client({
    host: 'http://search-neo-indexer-prod.atg.net/',
  });

  const result = await elasticsearchClient.search({
    index: 'next-products-ounass-prod-en_ae',
    type: 'product',
    body: {
      _source: [
        'motherReference',
        'styleColorId',
        'sku',
        'slug',
        'name',
        'description',
        'designerCategoryName',
        'price',
        'minPrice',
        'image',
      ],
      query: {
        bool: {
          must: [{
            match: {
              areAnyOptionsInStockFacet: 'yes',
            },
          }, {
            exists: {
              field: 'designerCategoryName',
            },
          }],
        },
      },
      size: 1000,
    },
  });

  fs.writeFile('../data/products.json', JSON.stringify(_.map(result.hits.hits, '_source')), () => {});
};

main().catch((err) => console.error(JSON.stringify(err, null, 4)));
