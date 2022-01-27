const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true,
}));

router.use('/build', express.static(`${__dirname}/frontend/build/`));
router.use('/static', express.static(`${__dirname}/frontend/static/`));

router.post('/cart/addItem', require('./express-middleware/cart/add-item'));

router.get('/:slug.html', require('./express-middleware/pdp'));

router.use((err, req, res, next) => {
  console.error(err);

  res.status(500).send('500');
});

module.exports = router;
