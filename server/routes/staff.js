const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // ✅ Added Supabase

console.log("✅ STAFF ROUTE FILE LOADED");

// 👉 TEST ROUTE
router.get("/test", (req, res) => {
  res.send("STAFF ROUTE WORKING");
});

// 👉 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if staff already exists in Supabase
    const { data: existing } = await supabase
      .from('staff')
      .select('email')
      .eq('email', email)
      .single()

    if (existing) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    // Save to Supabase
    const { error } = await supabase
      .from('staff')
      .insert([{ name, email, password }])

    if (error) throw error

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering staff" });
  }
});

// 👉 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find staff in Supabase
    const { data: staff, error } = await supabase
      .from('staff')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()

    if (error || !staff) {
      console.error("Login Error:", error || "Staff not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      staff
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

// 👉 GET ALL STAFF
router.get("/all", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select("name, email")

    if (error) throw error
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching staff" });
  }
});

module.exports = router;