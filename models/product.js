const mongoose = require("mongoose");
const Joi = require("joi");
const { categorySchema } = require("./category");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: categorySchema, required: true },
  numberInStock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = {
    name: Joi.string().required(),
    categoryId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0),
    price: Joi.number().min(0),
  };
  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
