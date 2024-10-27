const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const User = require("../models/user.model");
const handleResponse = require("../utils/response.util");

// Validation schema for registration and login
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Generate JWT token function
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "72h" }
  );
};

// Register User
const registerUser = async (req, res) => {
  try {
    // Validate request data
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, "error", error.details[0].message);
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleResponse(res, 400, "error", "User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Respond with user data and token
    return handleResponse(res, 201, "success", "User registered successfully", {
      user: { username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    return handleResponse(res, 500, "error", "Server error", error.message);
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    // Validate request data
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return handleResponse(res, 400, "error", error.details[0].message);
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return handleResponse(res, 400, "error", "Invalid email or password");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleResponse(res, 400, "error", "Invalid email or password");
    }

    // Generate token
    const token = generateToken(user);

    // Respond with user data and token
    return handleResponse(res, 200, "success", "Login successful", {
      user: { username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    return handleResponse(res, 500, "error", "Server error", error.message);
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return handleResponse(res, 401, "error", "Unauthorized");
    }

    // Get user data
    const user = await User.findById(req.user.userId);

    // Respond with user data
    return handleResponse(res, 200, "success", "User retrieved successfully", {
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    return handleResponse(res, 500, "error", "Server error", error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
