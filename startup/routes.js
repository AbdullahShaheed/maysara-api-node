const express = require("express");
const error = require("../middleware/error");
const categories = require("../routes/categories");
const customers = require("../routes/customers");
const products = require("../routes/products");
const orders = require("../routes/orders");
const users = require("../routes/users");
const logins = require("../routes/logins");

module.exports = function (app) {
  app.use(express.json());
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
  });
  app.use(categories);
  app.use(products);
  app.use(customers);
  app.use(orders);
  app.use(users);
  app.use(logins);
  app.use(error);
};
