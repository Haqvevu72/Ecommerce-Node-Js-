const mongoose = require('mongoose');

// Define the Basket schema
const basketSchema = new mongoose.Schema({
  products: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Minimum quantity of 1
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "cancelled", "confirmed"],
    default: "pending", // Default status
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Minimum price of 0
  },
  currency: {
    type: String,
    enum: ["$", "€", "₼"],
    required: true,
  },
});

// Create and export the Basket model
const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;
