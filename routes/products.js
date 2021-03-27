const { Product, validate } = require("../models/product");
const { Category } = require("../models/category");
const authorize = require("../middleware/authorize");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

router.get("/api/products", async (req, res) => {
  const products = await Product.find().sort("name");
  res.send(products);
});

router.get("/api/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).send("Product with the given id was not found.");

  res.send(product);
});

router.post("/api/products", authorize, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid category.");

  const product = new Product({
    name: req.body.name,
    category: {
      _id: category._id,
      name: category.name,
    },
    numberInStock: req.body.numberInStock,
    price: req.body.price,
  });

  await product.save();
  res.send(product);
});

router.put("/api/products/:id", authorize, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid category.");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category: {
        _id: category._id,
        name: category.name,
      },
      numberInStock: req.body.numberInStock,
      price: req.body.price,
    },
    { new: true }
  );
  if (!product)
    return res.status(404).send("Product with the given id was not found.");

  res.send(product);
});

router.delete("/api/products/:id", [authorize, admin], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);
  if (!product)
    return res.status(404).send("Product has been already deleted.");
  res.send(product);
});

module.exports = router;
