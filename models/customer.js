const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, default: null },
    address: { type: String, default: null },
  })
);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().required(),
    phone: Joi.string().allow(null),
    address: Joi.string().allow(null),
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
