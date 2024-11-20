// routes/productRoute.js
const express = require("express");
const Product = require("../model/product");
const {authMiddleware,isAdminMiddleware,} = require("../middleware/auth"); // Import both middlewares

const router = express.Router();

// Create product (admin only)
router.post("/add", authMiddleware, isAdminMiddleware, async (req, res) => {
  const { title, description, price, currency, category, stock, gallery } =
    req.body;

  try {
    const newProduct = new Product({
      title,
      description,
      price,
      currency,
      category,
      stock,
      gallery,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// Update product (admin only)
router.put("/:id", authMiddleware, isAdminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, price, currency, category, stock, gallery } =
    req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        currency,
        category,
        stock,
        gallery,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Delete product (admin only)
router.delete("/:id", authMiddleware, isAdminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// Read products (no token required)
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

  const skip = (page - 1) * limit;
  const products = await Product.find().skip(skip).limit(Number(limit));

  const totalProducts = await Product.countDocuments();

  res.status(200).json({
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  });
});

module.exports = router;
