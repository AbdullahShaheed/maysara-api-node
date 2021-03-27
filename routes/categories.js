const { Category, validate } = require("../models/category");
const authorize = require("../middleware/authorize");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

router.get("/api/categories", async (req, res) => {
  const categories = await Category.find().sort("name");
  res.send(categories);
});

router.get("/api/categories/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category)
    return res.status(404).send("Category with the given id was not found.");

  res.send(category);
});

router.post("/api/categories", authorize, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category({
    name: req.body.name,
  });

  await category.save();
  res.send(category);
});

router.put("/api/categories/:id", authorize, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!category)
    return res.status(404).send("Category with the given id was not found.");

  res.send(category);
});

router.delete("/api/categories/:id", [authorize, admin], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);
  if (!category)
    return res
      .status(404)
      .send("The category with the given id has been already deleted.");

  res.send(category);
});

module.exports = router;
