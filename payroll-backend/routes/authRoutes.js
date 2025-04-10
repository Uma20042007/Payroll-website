// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Register a new user
router.post("/register", register);

// Login an existing user
router.post("/login", login);

module.exports = router;
