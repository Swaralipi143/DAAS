const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "your_random_secret_key";

const ALLOWED_ROLES = ["admin", "author"];

// JWT Token Generator
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Format response
const getUserResponse = (user, token) => ({
  message: "Success",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
});

// ==========================
// REGISTER
// ==========================
router.post("/register", async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    role = role || "author";

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    const savedUser = await newUser.save();
    const token = generateToken(savedUser);

    res.status(201).json(getUserResponse(savedUser, token));
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `User is not registered as ${role}` });
    }

    const token = generateToken(user);
    res.status(200).json(getUserResponse(user, token));
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// ==========================
// GET ALL USERS (ADMIN ONLY)
// ==========================
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view users" });
    }

    const { role } = req.query;
    const filters = role ? { role } : {};

    const users = await User.find(filters).select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// ==========================
// GET CURRENT USER PROFILE
// ==========================
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ==========================
// UPDATE CURRENT USER PROFILE
// ==========================
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const { name, email, institution } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, institution },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ message: "Error updating user profile", error: err.message });
  }
});

module.exports = router;
