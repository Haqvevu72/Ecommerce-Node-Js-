// routes/basketRoute.js
const express = require('express');
const Basket = require('../model/basket');
const Product = require('../model/product'); // Assuming you have a Product model
const {authMiddleware} = require('../middleware/auth');  // Import the auth middleware

const router = express.Router();

// Apply the token verification middleware to all routes
router.use(authMiddleware);  // All routes will require token validation

// Create or update basket (token required)
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;  // Product ID and quantity to add to the basket
  const userId = req.user._id;  // User ID from the validated token

  try {
    // Find existing basket or create a new one
    let basket = await Basket.findOne({ userId });

    if (!basket) {
      // If no basket exists, create a new one
      basket = new Basket({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      // If basket exists, update it by adding a product or updating quantity
      const productIndex = basket.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex !== -1) {
        // Product exists in the basket, update quantity
        basket.products[productIndex].quantity += quantity;
      } else {
        // Product doesn't exist, add to basket
        basket.products.push({ productId, quantity });
      }
    }

    // Calculate the total price (optional: based on the price of products in the basket)
    let totalPrice = 0;
    for (const item of basket.products) {
      const product = await Product.findById(item.productId);
      totalPrice += product.price * item.quantity;
    }
    basket.price = totalPrice;

    // Save the basket
    await basket.save();

    res.status(200).json({ message: 'Basket updated successfully', basket });
  } catch (error) {
    res.status(500).json({ message: 'Error updating basket', error });
  }
});

// View basket (token required)
router.get('/', async (req, res) => {
  const userId = req.user._id;  // Get user ID from validated token

  try {
    const basket = await Basket.findOne({ userId }).populate('products.productId');
    if (!basket) {
      return res.status(404).json({ message: 'Basket not found for this user' });
    }
    res.status(200).json({ basket });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving basket', error });
  }
});

// Remove product from basket (token required)
router.delete('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;  // Get user ID from validated token

  try {
    const basket = await Basket.findOne({ userId });
    if (!basket) {
      return res.status(404).json({ message: 'Basket not found for this user' });
    }

    // Remove product from basket
    basket.products = basket.products.filter(
      (item) => item.productId.toString() !== productId
    );

    // Recalculate price
    let totalPrice = 0;
    for (const item of basket.products) {
      const product = await Product.findById(item.productId);
      totalPrice += product.price * item.quantity;
    }
    basket.price = totalPrice;

    // Save updated basket
    await basket.save();
    res.status(200).json({ message: 'Product removed from basket', basket });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from basket', error });
  }
});

// Clear basket (token required)
router.delete('/', async (req, res) => {
  const userId = req.user._id;  // Get user ID from validated token

  try {
    const basket = await Basket.findOneAndDelete({ userId });

    if (!basket) {
      return res.status(404).json({ message: 'Basket not found for this user' });
    }

    res.status(200).json({ message: 'Basket cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing basket', error });
  }
});

module.exports = router;
