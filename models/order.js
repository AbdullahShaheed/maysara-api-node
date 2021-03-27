const mongoose = require("mongoose");
const Joi = require("joi");

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  qty: { type: Number, required: true, min: 0 },
  totalPrice: Number,
});

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    date: { type: Date, default: Date.now },
    //custom brief schema for a customer -essentials properties-
    //in other words, we are not re-using the customer schema that we defined in the customer.js module (video 9-7)
    customer: {
      type: new mongoose.Schema({
        name: String,
        phone: String,
      }),
      required: true,
    },
    items: [
      {
        type: itemSchema,
        required: true,
      },
    ],
    total: Number,
  })
);

function validateOrder(order) {
  //The idea is the client should only send ids (customerId and array of productIds along with quantities)
  const schema = {
    date: Joi.date(), //assume we get the order date from the client and validate it here, if not supplied the Date.now will applied acording to the order schema
    customerId: Joi.objectId().required(),
    items: Joi.array()
      // .items(Joi.objectId().required())
      .error(() => {
        return { message: "Invalid product id." };
      }),
    total: Joi.number(),
  };
  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
