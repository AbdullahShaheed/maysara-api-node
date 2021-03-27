const { Order, validate } = require("../models/order");
const { Customer } = require("../models/customer");
const { Product } = require("../models/product");
const authorize = require("../middleware/authorize");
const express = require("express");
const router = express.Router();

router.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort("date");
  res.send(orders);
});

router.post("/api/orders", authorize, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  //composing the array of ordered items (_id, name, price, qty, totalPrice)
  //the client should send only productIds and qtys
  let product = {};
  const items = [];
  for (let item of req.body.items) {
    product = await Product.findById(item.productId);
    if (!product) return res.status(400).send("Invalid product.");

    if (product.numberInStock < item.qty)
      return res.status(400).send("Product not in stock.");

    const itm = {};
    itm._id = product._id;
    itm.name = product.name;
    itm.price = product.price;
    itm.qty = item.qty;
    // itm.totalPrice = product.price * item.qty;
    itm.totalPrice = item.totalPrice; //comes calculated at the client
    items.push(itm);
  }

  const order = new Order({
    date: req.body.date,
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    items: items,
    total: req.body.total,
  });

  await order.save();

  // update the stock for each product
  let prod = {};
  for (let item of req.body.items) {
    prod = await Product.findById(item.productId);
    prod.numberInStock = prod.numberInStock - item.qty;
    await prod.save();
  }

  res.send(order);
});

module.exports = router;
