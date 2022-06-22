const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  name: String,
  price: Number,
  published: Boolean,
  image: String,
});

module.exports = new mongoose.model("Product", Schema);
