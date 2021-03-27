const { Customer, validate } = require("../models/customer");
const authorize = require("../middleware/authorize");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

router.get("/api/customers", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/api/customers/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with the given id was not found.");

  res.send(customer);
});

router.post("/api/customers", authorize, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  });

  await customer.save();
  res.send(customer);
});

router.put("/api/customers/:id", authorize, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    },
    { new: true }
  );
  if (!customer)
    return res.status(404).send("Customer with the given id was not found.");

  res.send(customer);
});

router.delete("/api/customers/:id", [authorize, admin], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send("Customer has been already deleted.");
  res.send(customer);
});

module.exports = router;
