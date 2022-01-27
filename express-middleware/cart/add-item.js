module.exports = async (req, res) => {
  await new Promise((resolve) => setTimeout(
    resolve,
    500 + Math.random() * 1000,
  ));

  res.send({
    items: [{
      sku: req.body.sku,
      qty: 1,
    }],
  });
};
