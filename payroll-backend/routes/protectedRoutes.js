const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/authorizeRole");

// Admin-only route
router.get("/admin", verifyToken, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Welcome Admin! You have full access." });
});

// Manager-only route
router.get("/manager", verifyToken, authorizeRole("manager"), (req, res) => {
  res.json({ message: "Welcome Manager! You can view your team." });
});

// Employee-only route
router.get("/employee", verifyToken, authorizeRole("employee"), (req, res) => {
  res.json({ message: "Welcome Employee! You can view your own data." });
});

module.exports = router;
