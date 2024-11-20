const mongoose = require('mongoose');

// Define the schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    enum: ["$", "€", "₼"],
    required: true,
  },
  category: {
    type: String,
    enum: ["tech", "fashion", "cars"],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  gallery: {
    type: [String],
    validate: {
      validator: function (array) {
        return array.every((url) => typeof url === "string");
      },
      message: "Gallery must contain an array of strings (URLs).",
    },
  },
});

// Create and export the model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
