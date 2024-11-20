// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import your route files
const authRoute = require("./routes/authRoute"); // Adjust path as needed
const productRoute = require("./routes/productRoute"); // Adjust path as needed
const basketRoute = require("./routes/basketRoute"); // Adjust path as needed

// Initialize express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON bodies

// Database connection using Mongoose
const connectDB = async () => {
  try {
    // MongoDB connection URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if connection fails
  }
};

// Call the database connection function
connectDB();

// Define routes
app.use("/api/auth", authRoute); // Auth routes: login, register, refresh tokens
app.use("/api/products", productRoute); // Product routes: create, update, delete, read
app.use("/api/basket", basketRoute); // Basket routes: add, remove items, view basket

// Define a default route (optional)
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
