const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        // Basic email regex validation
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
  basket: {
    type: mongoose.Schema.Types.ObjectId, // Reference to another collection
    ref: 'Basket',
  },
  admin: {
    type: Boolean,
    default: false, // Default is not an admin
  },
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
