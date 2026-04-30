const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");

console.log("✅ STAFF ROUTE FILE LOADED");

// 👉 TEST ROUTE (IMPORTANT)
router.get("/test", (req, res) => {
  res.send("STAFF ROUTE WORKING");
});

// 👉 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const staff = new Staff({ name, email, password });
    await staff.save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error registering staff" });
  }
});

// 👉 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email, password });

    if (!staff) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      staff
    });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// 👉 GET ALL STAFF
router.get("/all", async (req, res) => {
  try {
    const staff = await Staff.find().select("name email");
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: "Error fetching staff" });
  }
});

module.exports = router;